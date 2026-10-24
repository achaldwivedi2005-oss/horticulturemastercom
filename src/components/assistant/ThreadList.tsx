import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, MessageSquare, Plus, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { createThread, threadsQuery } from "@/lib/ai/threads";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Thread navigation: list of the student's saved chats + "New chat". */
export function ThreadList({ userId, activeId, onNavigate }: { userId: string; activeId?: string | undefined; onNavigate?: (() => void) | undefined }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: threads = [], isLoading } = useQuery(threadsQuery(userId));
  const [creating, setCreating] = useState(false);

  const newChat = async () => {
    setCreating(true);
    try {
      const id = await createThread(userId);
      await queryClient.invalidateQueries({ queryKey: ["chat-threads", userId] });
      onNavigate?.();
      navigate({ to: "/chat/$threadId", params: { threadId: id } });
    } catch {
      toast.error("Couldn't start a new chat.");
    } finally {
      setCreating(false);
    }
  };

  const remove = async (id: string) => {
    const { error } = await supabase.from("chat_threads").delete().eq("id", id);
    if (error) return toast.error("Couldn't delete the chat.");
    await queryClient.invalidateQueries({ queryKey: ["chat-threads", userId] });
    if (id === activeId) navigate({ to: "/assistant" });
  };

  return (
    <div className="flex h-full flex-col gap-3">
      <Button variant="hero" onClick={newChat} disabled={creating} className="w-full">
        {creating ? <Loader2 className="animate-spin" /> : <Plus />} New chat
      </Button>
      <p className="px-1 pt-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">Your chats</p>
      <nav className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto" aria-label="Saved chats">
        {isLoading && <p className="px-2 text-sm text-muted-foreground">Loading…</p>}
        {!isLoading && threads.length === 0 && (
          <p className="px-2 text-sm text-muted-foreground">No chats yet — start one above.</p>
        )}
        {threads.map((t) => (
          <div
            key={t.id}
            className={cn(
              "group flex items-center gap-1 rounded-xl pr-1 transition-colors hover:bg-secondary",
              t.id === activeId && "bg-secondary",
            )}
          >
            <Link
              to="/chat/$threadId"
              params={{ threadId: t.id }}
              onClick={onNavigate}
              className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2.5 text-sm"
            >
              <MessageSquare className="size-4 shrink-0 text-primary" />
              <span className="truncate">{t.title}</span>
            </Link>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label={`Delete chat ${t.title}`}
              onClick={() => remove(t.id)}
              className="opacity-60 hover:opacity-100"
            >
              <Trash2 className="text-destructive" />
            </Button>
          </div>
        ))}
      </nav>
    </div>
  );
}
