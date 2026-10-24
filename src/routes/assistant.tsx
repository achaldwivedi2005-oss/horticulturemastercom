import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { threadsQuery } from "@/lib/ai/threads";
import { ChatWindow } from "@/components/assistant/ChatWindow";
import { ThreadList } from "@/components/assistant/ThreadList";
import { LogoMark } from "@/components/site/Logo";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "AI Assistant — Horticulture Master" },
      {
        name: "description",
        content:
          "Chat with the Horticulture Master AI assistant for horticulture concepts, practice MCQs and CUET-PG, ICAR JRF/SRF and ASRB NET strategy.",
      },
      { property: "og:title", content: "Horticulture Master AI Assistant" },
      {
        property: "og:description",
        content: "Your AI study mentor for horticulture competitive exams — ask questions, get MCQs and a study plan.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssistantPage,
});

function AssistantPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  // Visitors get a short free preview; history isn't saved until they log in.
  if (!user) {
    return (
      <div className="flex h-[calc(100dvh-4rem)] flex-col md:h-[calc(100dvh-4.5rem)]">
        <ChatWindow guest />
      </div>
    );
  }

  return <SignedInHub userId={user.id} />;
}

/** Signed-in landing: jump into the latest chat, or show the empty hub. */
function SignedInHub({ userId }: { userId: string }) {
  const navigate = useNavigate();
  const { data: threads, isLoading } = useQuery(threadsQuery(userId));

  useEffect(() => {
    const latest = threads?.[0];
    if (latest) navigate({ to: "/chat/$threadId", params: { threadId: latest.id }, replace: true });
  }, [threads, navigate]);

  if (isLoading || threads?.length) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <section className="container-page flex min-h-[70vh] flex-col items-center justify-center py-12 text-center">
      <LogoMark className="size-20" />
      <h1 className="mt-4 text-3xl font-semibold sm:text-4xl">Your AI study mentor</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Start a chat to ask about any horticulture topic, get practice MCQs, or plan your exam preparation. Your chats are
        saved to your account.
      </p>
      <div className="mt-8 w-full max-w-xs">
        <ThreadList userId={userId} />
      </div>
    </section>
  );
}
