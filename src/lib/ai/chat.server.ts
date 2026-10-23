import { createOpenAI } from "@ai-sdk/openai";
import { convertToModelMessages, generateId, isStepCount, streamText, tool, type UIMessage } from "ai";
import { createClient } from "@supabase/supabase-js";
import { z } from "zod/v4";
import type { Database } from "@/integrations/supabase/types";
import { guestLimitReached } from "./limits";
import { createLovableAiGatewayRunIdFetch, getLovableAiGatewayRunId, withLovableAiGatewayRunIdHeader } from "./run-id";

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1";
const MODEL = "openai/gpt-6-astra";
const MAX_MESSAGES = 80;

type Profile = Pick<
  Database["public"]["Tables"]["profiles"]["Row"],
  "full_name" | "target_exam" | "university" | "state" | "preparation_from" | "goal"
>;

const bodySchema = z.object({
  messages: z.array(z.any()).min(1).max(MAX_MESSAGES),
  threadId: z.string().uuid().optional(),
});

function json(status: number, message: string) {
  return Response.json({ error: message }, { status });
}

function buildInstructions(profile: Profile | null, signedIn: boolean) {
  const known = profile
    ? [
        profile.full_name && `Name: ${profile.full_name}`,
        profile.target_exam && `Target exam: ${profile.target_exam}`,
        profile.university && `University: ${profile.university}`,
        profile.state && `State: ${profile.state}`,
        profile.preparation_from && `Preparing from: ${profile.preparation_from}`,
        profile.goal && `Goal: ${profile.goal}`,
      ].filter(Boolean)
    : [];
  const missing = signedIn
    ? ["name", "where they are preparing from (self-study, coaching, city)", "university", "goal"].filter((field) => {
        if (!profile) return true;
        if (field === "name") return !profile.full_name;
        if (field.startsWith("where")) return !profile.preparation_from;
        if (field === "university") return !profile.university;
        if (field === "goal") return !profile.goal;
        return false;
      })
    : ["name", "where they are preparing from", "university", "goal"];

  return `You are the Horticulture Master AI assistant — a warm, encouraging and knowledgeable mentor for Indian students preparing for agriculture and horticulture competitive exams: CUET-PG, ICAR JRF, ICAR SRF (Ph.D.), ASRB NET and similar exams.

Language & tone: Always reply in clear, polished, friendly English (simple words, short paragraphs). If the student writes in Hindi or Hinglish, still answer in English but you may add a short Hindi phrase of encouragement.

Expertise: Vegetable Science, Fruit Science (Pomology), Floriculture & Landscaping, Plantation crops, Spices, Medicinal & Aromatic plants, Post-Harvest Technology, Plant Propagation & Nursery Management, Plant Physiology, Breeding & Biotechnology, Soil science basics, Agri statistics and current affairs relevant to these exams. Give exam-oriented answers: key facts, scientific names, varieties, important numbers, mnemonics, and when helpful 1–3 practice MCQs with answers and short explanations.

Accuracy: Never invent exam dates, vacancy numbers, cut-offs or notifications. If you are unsure or the information may have changed, say so and advise checking the official notification (ICAR, NTA, ASRB, or the university website).

Getting to know the student: ${
    missing.length
      ? `At the start of a new conversation, before deep teaching, warmly greet the student and politely ask for these details you don't know yet: ${missing.join(", ")}. Ask them together in one friendly message (numbered list), then continue helping with whatever they asked.${
          signedIn
            ? " As soon as the student shares any of these details, call the save_student_profile tool to save them, then thank them briefly and personalise your guidance."
            : ""
        }`
      : "You already know this student's details below — greet them by first name and personalise your guidance."
  }
${known.length ? `\nKnown student details:\n${known.join("\n")}` : ""}

Format: Use Markdown headings, bullet points and bold for key terms. Keep answers focused; offer to go deeper.`;
}

/** Validate the caller's bearer token (if any). Returns a user-scoped client + id, or null for guests. */
async function getCaller(request: Request) {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  if (token.split(".").length !== 3) return null;
  const url = process.env["SUPABASE_URL"];
  const key = process.env["SUPABASE_PUBLISHABLE_KEY"];
  if (!url || !key) throw new Error("Backend is not configured");
  const supabase = createClient<Database>(url, key, {
    global: {
      headers: { Authorization: `Bearer ${token}` },
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
  });
  const { data, error } = await supabase.auth.getClaims(token);
  if (error || !data?.claims?.sub) return null;
  return { supabase, userId: data.claims.sub };
}

/** Drop stored reasoning from earlier turns: it isn't needed for context and may not be replayable. */
function stripReasoning(messages: UIMessage[]): UIMessage[] {
  return messages.map((m) => ({ ...m, parts: m.parts.filter((p) => p.type !== "reasoning") }));
}

function firstText(message: UIMessage | undefined) {
  const part = message?.parts.find((p) => p.type === "text");
  return part && "text" in part ? part.text : "";
}

export async function handleChat(request: Request) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return json(500, "AI is not configured yet.");

  let body: z.infer<typeof bodySchema>;
  try {
    body = bodySchema.parse(await request.json());
  } catch {
    return json(400, "Invalid request.");
  }
  const messages = body.messages as UIMessage[];
  const last = messages[messages.length - 1];
  if (!last || last.role !== "user" || !firstText(last).trim()) return json(400, "Please type a message.");
  if (firstText(last).length > 4000) return json(400, "Message is too long (max 4000 characters).");

  const caller = await getCaller(request);

  let profile: Profile | null = null;
  if (caller) {
    if (!body.threadId) return json(400, "Missing chat.");
    const { data: thread } = await caller.supabase
      .from("chat_threads")
      .select("id, title")
      .eq("id", body.threadId)
      .maybeSingle();
    if (!thread) return json(404, "Chat not found.");

    const { data: p } = await caller.supabase
      .from("profiles")
      .select("full_name, target_exam, university, state, preparation_from, goal")
      .eq("id", caller.userId)
      .maybeSingle();
    profile = p;

    // Save the student's new message before generating the reply.
    const { error: insertError } = await caller.supabase.from("chat_messages").upsert(
      { thread_id: thread.id, user_id: caller.userId, ui_id: last.id, role: "user", message: last as never },
      { onConflict: "thread_id,ui_id", ignoreDuplicates: true },
    );
    if (insertError) {
      console.error("chat: failed to save user message", insertError);
      return json(500, "Couldn't save your message. Please try again.");
    }
    if (thread.title === "New chat") {
      await caller.supabase
        .from("chat_threads")
        .update({ title: firstText(last).trim().slice(0, 60) || "New chat" })
        .eq("id", thread.id);
    } else {
      await caller.supabase.from("chat_threads").update({ updated_at: new Date().toISOString() }).eq("id", thread.id);
    }
  } else if (guestLimitReached(messages)) {
    return json(401, "Please log in to keep chatting with the assistant.");
  }

  const tools = caller
    ? {
        save_student_profile: tool({
          description:
            "Save details the student shared about themselves (name, where they prepare from, university, goal). Only include fields the student actually told you.",
          inputSchema: z.object({
            full_name: z.string().nullable(),
            preparation_from: z.string().nullable(),
            university: z.string().nullable(),
            goal: z.string().nullable(),
          }),
          execute: async (input) => {
            const update: Partial<Profile> = {};
            if (input.full_name?.trim()) update.full_name = input.full_name.trim().slice(0, 100);
            if (input.preparation_from?.trim()) update.preparation_from = input.preparation_from.trim().slice(0, 200);
            if (input.university?.trim()) update.university = input.university.trim().slice(0, 200);
            if (input.goal?.trim()) update.goal = input.goal.trim().slice(0, 300);
            if (Object.keys(update).length === 0) return { saved: false };
            const { error } = await caller.supabase.from("profiles").update(update).eq("id", caller.userId);
            return error ? { saved: false, error: "Could not save" } : { saved: true, fields: Object.keys(update) };
          },
        }),
      }
    : undefined;

  const runIdFetch = createLovableAiGatewayRunIdFetch(getLovableAiGatewayRunId(request));
  const provider = createOpenAI({
    baseURL: GATEWAY_URL,
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });

  const result = streamText({
    model: provider.responses(MODEL),
    instructions: buildInstructions(profile, !!caller),
    messages: await convertToModelMessages(stripReasoning(messages), { ignoreIncompleteToolCalls: true }),
    ...(tools ? { tools, stopWhen: isStepCount(50) } : {}),
    abortSignal: request.signal,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
        include: ["reasoning.encrypted_content"],
      },
    },
  });

  const response = result.toUIMessageStreamResponse({
    originalMessages: messages,
    sendReasoning: true,
    generateMessageId: generateId,
    onError: (error) => {
      console.error("chat stream error", error);
      const status = (error as { statusCode?: number })?.statusCode;
      if (status === 402) return "AI credits have run out. Please try again later.";
      if (status === 429) return "The assistant is busy right now. Please wait a moment and try again.";
      return "Something went wrong while answering. Please try again.";
    },
    onFinish: async ({ responseMessage }) => {
      if (!caller || !body.threadId || !responseMessage?.parts?.length) return;
      const { error } = await caller.supabase.from("chat_messages").insert({
        thread_id: body.threadId,
        user_id: caller.userId,
        ui_id: responseMessage.id || generateId(),
        role: "assistant",
        message: responseMessage as never,
      });
      if (error) console.error("chat: failed to save assistant message", error);
    },
  });

  return withLovableAiGatewayRunIdHeader(response, runIdFetch);
}
