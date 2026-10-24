import { useState } from "react";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PanelLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { threadMessagesQuery } from "@/lib/ai/threads";
import { ChatWindow } from "@/components/assistant/ChatWindow";
import { ThreadList } from "@/components/assistant/ThreadList";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export const Route = createFileRoute("/_authenticated/chat/$threadId")({
  loader: async ({ params, context }) => {
    const { data } = await supabase.from("chat_threads").select("id").eq("id", params.threadId).maybeSingle();
    if (!data) throw notFound();
    await context.queryClient.ensureQueryData(threadMessagesQuery(params.threadId));
  },
  head: () => ({
    meta: [
      { title: "Chat — Horticulture Master AI Assistant" },
      { name: "description", content: "Your saved conversation with the Horticulture Master AI assistant." },
      { property: "og:title", content: "Horticulture Master AI Assistant" },
      { property: "og:description", content: "Your saved conversation with the Horticulture Master AI assistant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ChatThreadPage,
});

function ChatThreadPage() {
  const { threadId } = Route.useParams();
  const { user } = Route.useRouteContext();
  const { data: initialMessages } = useSuspenseQuery(threadMessagesQuery(threadId));
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-[calc(100dvh-4rem)] md:h-[calc(100dvh-4.5rem)]">
      <aside className="hidden w-72 shrink-0 border-r border-border bg-muted/30 p-4 lg:block">
        <ThreadList userId={user.id} activeId={threadId} />
      </aside>
      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="flex items-center border-b border-border px-3 py-2 lg:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <PanelLeft /> Chats
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] max-w-xs bg-background p-4">
              <SheetHeader className="p-0 pb-3">
                <SheetTitle className="font-display">Your chats</SheetTitle>
              </SheetHeader>
              <ThreadList userId={user.id} activeId={threadId} onNavigate={() => setOpen(false)} />
            </SheetContent>
          </Sheet>
        </div>
        <ChatWindow key={threadId} threadId={threadId} initialMessages={initialMessages} />
      </div>
    </div>
  );
}
