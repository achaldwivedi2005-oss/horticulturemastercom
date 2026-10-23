import { createFileRoute, redirect } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  Users,
  Mail,
  Trash2,
  FileQuestion,
  ClipboardCheck,
  Library,
  Briefcase,
  Megaphone,
  PencilLine,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/site/EmptyState";
import { StatusBadge } from "@/components/site/StatusBadge";

export const Route = createFileRoute("/_authenticated/admin")({
  beforeLoad: async ({ context }) => {
    const { data } = await supabase.rpc("has_role", { _user_id: context.user.id, _role: "admin" });
    if (data !== true) throw redirect({ to: "/dashboard" });
  },
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Horticulture Master" },
      { name: "description", content: "Manage students, messages and published content." },
      { property: "og:title", content: "Admin Dashboard — Horticulture Master" },
      { property: "og:description", content: "Manage students, messages and published content." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

function useStudents() {
  return useQuery({
    queryKey: ["admin", "students"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, target_exam, university, state, phone, created_at")
        .order("created_at", { ascending: false })
        .limit(500);
      if (error) throw error;
      return data;
    },
  });
}

function useMessages() {
  return useQuery({
    queryKey: ["admin", "messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("id, name, email, message, created_at")
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return data;
    },
  });
}

const contentModules = [
  { icon: FileQuestion, title: "Questions", text: "Add MCQs, correct answers and explanations", stage: "Stage 3" },
  { icon: ClipboardCheck, title: "Quizzes", text: "Build tests, set timer and marking scheme", stage: "Stage 3" },
  { icon: PencilLine, title: "Answers & explanations", text: "Edit any question after publishing", stage: "Stage 3" },
  { icon: Library, title: "Study materials", text: "Upload notes & PDFs by subject and topic", stage: "Stage 4" },
  { icon: Briefcase, title: "Job posts", text: "Publish vacancies with deadlines & official links", stage: "Stage 5" },
  { icon: Megaphone, title: "Announcements", text: "Post exam notifications to the homepage", stage: "Stage 5" },
];

function AdminPage() {
  const students = useStudents();
  const messages = useMessages();

  return (
    <div className="container-page py-10 md:py-14">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Admin</p>
      <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Admin dashboard</h1>

      <div className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-4">
        <Stat icon={Users} label="Registered students" value={students.data?.length} loading={students.isLoading} />
        <Stat icon={Mail} label="Contact messages" value={messages.data?.length} loading={messages.isLoading} />
        <Stat icon={FileQuestion} label="Questions" soon />
        <Stat icon={Briefcase} label="Job posts" soon />
      </div>

      <Tabs defaultValue="students" className="mt-10">
        <TabsList className="h-auto flex-wrap rounded-full p-1">
          <TabsTrigger value="students" className="rounded-full px-4">Students</TabsTrigger>
          <TabsTrigger value="messages" className="rounded-full px-4">Messages</TabsTrigger>
          <TabsTrigger value="content" className="rounded-full px-4">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="mt-6">
          <StudentsTable rows={students.data} loading={students.isLoading} />
        </TabsContent>
        <TabsContent value="messages" className="mt-6">
          <MessagesList rows={messages.data} loading={messages.isLoading} />
        </TabsContent>
        <TabsContent value="content" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {contentModules.map((m) => (
              <div key={m.title} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-2">
                  <m.icon className="size-6 text-primary" />
                  <StatusBadge status="soon" label={m.stage} />
                </div>
                <p className="mt-4 font-semibold">{m.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{m.text}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  loading,
  soon,
}: {
  icon: typeof Users;
  label: string;
  value?: number | undefined;
  loading?: boolean | undefined;
  soon?: boolean | undefined;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <Icon className="size-5 text-primary" />
      <p className="mt-3 font-display text-3xl font-semibold">{soon || loading || value === undefined ? "—" : value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      {soon && <StatusBadge status="soon" className="mt-2" />}
    </div>
  );
}

type StudentRow = NonNullable<ReturnType<typeof useStudents>["data"]>[number];

function StudentsTable({ rows, loading }: { rows?: StudentRow[] | undefined; loading: boolean }) {
  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!rows?.length) return <EmptyState icon={Users} title="No students yet" description="New sign-ups will appear here." />;
  return (
    <div className="overflow-x-auto rounded-2xl border border-border bg-card">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="bg-muted/60 text-xs uppercase tracking-wider text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-semibold">Name</th>
            <th className="px-4 py-3 font-semibold">Exam</th>
            <th className="px-4 py-3 font-semibold">University</th>
            <th className="px-4 py-3 font-semibold">State</th>
            <th className="px-4 py-3 font-semibold">Phone</th>
            <th className="px-4 py-3 font-semibold">Joined</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.id} className="hover:bg-muted/30">
              <td className="px-4 py-3">
                <p className="font-medium">{r.full_name || "—"}</p>
                <p className="text-xs text-muted-foreground">{r.email}</p>
              </td>
              <td className="px-4 py-3">{r.target_exam || "—"}</td>
              <td className="max-w-[240px] truncate px-4 py-3" title={r.university ?? ""}>{r.university || "—"}</td>
              <td className="px-4 py-3">{r.state || "—"}</td>
              <td className="px-4 py-3">{r.phone || "—"}</td>
              <td className="px-4 py-3 text-muted-foreground">{format(new Date(r.created_at), "d MMM yyyy")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type MessageRow = NonNullable<ReturnType<typeof useMessages>["data"]>[number];

function MessagesList({ rows, loading }: { rows?: MessageRow[] | undefined; loading: boolean }) {
  const queryClient = useQueryClient();
  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("contact_messages").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Message deleted");
      void queryClient.invalidateQueries({ queryKey: ["admin", "messages"] });
    },
    onError: () => toast.error("Couldn't delete the message."),
  });

  if (loading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (!rows?.length) return <EmptyState icon={Mail} title="No messages yet" description="Messages from the contact page will appear here." />;
  return (
    <div className="grid gap-3">
      {rows.map((m) => (
        <article key={m.id} className="rounded-2xl border border-border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold">{m.name}</p>
              <a href={`mailto:${m.email}`} className="text-sm text-primary hover:underline">{m.email}</a>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{format(new Date(m.created_at), "d MMM yyyy, h:mm a")}</span>
              <Button variant="ghost" size="icon" aria-label="Delete message" onClick={() => del.mutate(m.id)} disabled={del.isPending}>
                <Trash2 className="text-destructive" />
              </Button>
            </div>
          </div>
          <p className="mt-3 whitespace-pre-wrap text-sm">{m.message}</p>
        </article>
      ))}
    </div>
  );
}
