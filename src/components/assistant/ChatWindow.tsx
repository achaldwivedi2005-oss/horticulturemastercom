import { useEffect, useMemo, useRef } from "react";
import { Link } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";
import { DefaultChatTransport, type UIMessage } from "ai";
import { toast } from "sonner";
import { LogIn, UserCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { GUEST_MESSAGE_LIMIT, countUserMessages } from "@/lib/ai/limits";
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Reasoning, ReasoningContent, ReasoningTrigger } from "@/components/ai-elements/reasoning";
import { Tool, ToolContent, ToolHeader, ToolOutput } from "@/components/ai-elements/tool";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";
import { LogoMark } from "@/components/site/Logo";

const starters = [
  "Explain the classification of fruit crops based on climate",
  "Give me 5 MCQs on floriculture with answers",
  "How should I plan ICAR JRF horticulture preparation in 6 months?",
  "Important varieties of tomato released by IIHR",
];

export function ChatWindow({
  threadId,
  initialMessages = [],
  guest = false,
}: {
  threadId?: string | undefined;
  initialMessages?: UIMessage[] | undefined;
  guest?: boolean | undefined;
}) {
  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: threadId ? { threadId } : {},
        headers: async (): Promise<Record<string, string>> => {
          if (guest) return {};
          const { data } = await supabase.auth.getSession();
          const token = data.session?.access_token;
          return token ? { Authorization: `Bearer ${token}` } : {};
        },
      }),
    [threadId, guest],
  );

  const queryClient = useQueryClient();
  const { messages, sendMessage, status, stop } = useChat({
    id: threadId ?? "guest",
    messages: initialMessages,
    transport,
    onFinish: () => {
      if (!threadId) return;
      void queryClient.invalidateQueries({ queryKey: ["chat-threads"] });
      void queryClient.invalidateQueries({ queryKey: ["chat-messages", threadId] });
    },
    onError: (error) => {
      let msg = error.message;
      try {
        const parsed = JSON.parse(error.message) as { error?: string };
        if (parsed.error) msg = parsed.error;
      } catch {
        /* plain text */
      }
      toast.error(msg || "Something went wrong. Please try again.");
    },
  });

  const busy = status === "submitted" || status === "streaming";
  const used = countUserMessages(messages);
  const guestLocked = guest && used >= GUEST_MESSAGE_LIMIT && !busy;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!busy) textareaRef.current?.focus();
  }, [busy, threadId]);

  const send = (text: string) => {
    const t = text.trim();
    if (!t || busy || guestLocked) return;
    void sendMessage({ text: t });
  };

  const onSubmit = (message: PromptInputMessage) => send(message.text ?? "");

  const lastIsUser = messages[messages.length - 1]?.role === "user";

  return (
    <div className="flex h-full min-h-0 flex-col">
      <Conversation className="min-h-0 flex-1">
        <ConversationContent className="mx-auto w-full max-w-3xl gap-6 px-4 py-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center sm:py-14">
              <LogoMark className="size-20" />
              <h2 className="mt-4 text-2xl font-semibold sm:text-3xl">Hello! I'm your Horticulture Master assistant</h2>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Ask me anything about horticulture topics, exam strategy for CUET-PG, ICAR JRF/SRF or ASRB NET, or ask for
                practice MCQs.
              </p>
              <div className="mt-6 grid w-full max-w-xl gap-2 sm:grid-cols-2">
                {starters.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="rounded-2xl border border-border bg-card px-4 py-3 text-left text-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-soft"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => (
              <Message key={m.id} from={m.role}>
                {m.role === "assistant" && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                    <LogoMark className="size-6" /> Horticulture Master AI
                  </div>
                )}
                <MessageContent
                  className={
                    m.role === "user"
                      ? "group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground"
                      : "w-full"
                  }
                >
                  {m.parts.map((part, i) => {
                    const key = `${m.id}-${i}`;
                    if (part.type === "text") {
                      return m.role === "user" ? (
                        <p key={key} className="whitespace-pre-wrap">
                          {part.text}
                        </p>
                      ) : (
                        <MessageResponse key={key}>{part.text}</MessageResponse>
                      );
                    }
                    if (part.type === "reasoning" && part.text) {
                      return (
                        <Reasoning key={key} isStreaming={status === "streaming" && part.state === "streaming"}>
                          <ReasoningTrigger />
                          <ReasoningContent>{part.text}</ReasoningContent>
                        </Reasoning>
                      );
                    }
                    if (part.type === "tool-save_student_profile") {
                      return (
                        <Tool key={key} defaultOpen={false} className="border-primary/20 bg-secondary/50">
                          <ToolHeader
                            type={part.type}
                            state={part.state}
                            title="Saved your details to your profile"
                          />
                          <ToolContent>
                            <ToolOutput output={part.output as never} errorText={part.errorText} />
                          </ToolContent>
                        </Tool>
                      );
                    }
                    return null;
                  })}
                </MessageContent>
              </Message>
            ))
          )}
          {busy && lastIsUser && (
            <div className="flex items-center gap-2">
              <LogoMark className="size-6" />
              <Shimmer className="text-sm">Thinking…</Shimmer>
            </div>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className="border-t border-border bg-background/80 px-4 pb-4 pt-3 backdrop-blur">
        <div className="mx-auto w-full max-w-3xl">
          {guestLocked ? (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-primary/25 bg-secondary/60 p-5 text-center sm:flex-row sm:text-left">
              <UserCheck className="size-8 shrink-0 text-primary" />
              <div className="flex-1">
                <p className="font-semibold">Log in to keep chatting</p>
                <p className="text-sm text-muted-foreground">
                  You've used your {GUEST_MESSAGE_LIMIT} free messages. Create a free account to continue and save your chats.
                </p>
              </div>
              <Button asChild variant="hero">
                <Link to="/auth" search={{ mode: "signup", redirect: "/assistant" }}>
                  <LogIn /> Log in / Sign up
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <PromptInput onSubmit={onSubmit}>
                <PromptInputTextarea
                  ref={textareaRef}
                  placeholder="Ask about any horticulture topic…"
                  maxLength={4000}
                  disabled={guestLocked}
                />
                <PromptInputFooter className="justify-end">
                  <PromptInputSubmit status={status} onStop={stop} />
                </PromptInputFooter>
              </PromptInput>
              <p className="mt-2 text-center text-[0.7rem] text-muted-foreground">
                {guest
                  ? `Free preview: ${Math.max(GUEST_MESSAGE_LIMIT - used, 0)} of ${GUEST_MESSAGE_LIMIT} messages left. `
                  : ""}
                AI can make mistakes — verify exam dates and notifications on official websites.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
