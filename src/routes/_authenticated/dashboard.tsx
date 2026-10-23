import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Bookmark,
  ClipboardList,
  Target,
  Trophy,
  Pencil,
  Loader2,
  GraduationCap,
  MapPin,
  Phone,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { profileSchema } from "@/lib/profile-schema";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/site/EmptyState";
import { StatusBadge } from "@/components/site/StatusBadge";
import { Reveal } from "@/components/site/Reveal";
import { ProfileFields, toFieldErrors, type ProfileValues } from "@/components/account/ProfileFields";

const profileQuery = (userId: string) =>
  queryOptions({
    queryKey: ["profile", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, email, full_name, target_exam, university, state, phone, created_at")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({
    meta: [
      { title: "My Dashboard — Horticulture Master" },
      { name: "description", content: "Your quiz history, scores, accuracy and bookmarked questions." },
      { property: "og:title", content: "My Dashboard — Horticulture Master" },
      { property: "og:description", content: "Your personal preparation dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(profileQuery(context.user.id)),
  component: DashboardPage,
});

function DashboardPage() {
  const { user } = Route.useRouteContext();
  const { isAdmin } = useAuth();
  const { data: profile } = useSuspenseQuery(profileQuery(user.id));
  const [editing, setEditing] = useState(false);

  const firstName = profile?.full_name?.split(" ")[0] || "there";
  const incomplete = !profile?.target_exam || !profile?.university || !profile?.state || !profile?.full_name;

  const stats = [
    { label: "Tests taken", icon: ClipboardList },
    { label: "Best score", icon: Trophy },
    { label: "Accuracy", icon: Target },
    { label: "Bookmarks", icon: Bookmark },
  ];

  return (
    <div className="bg-gradient-hero">
      <div className="container-page py-10 md:py-14">
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">Student dashboard</p>
            <h1 className="mt-2 text-4xl font-semibold sm:text-5xl">Hello, {firstName}</h1>
            {profile?.target_exam && (
              <p className="mt-2 text-muted-foreground">
                Preparing for <strong className="text-foreground">{profile.target_exam}</strong>
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {isAdmin && (
              <Button asChild variant="soft" size="lg">
                <Link to="/admin">
                  <ShieldCheck /> Admin dashboard
                </Link>
              </Button>
            )}
            <Button asChild variant="hero" size="lg">
              <Link to="/quizzes">
                Practice now <ArrowRight />
              </Link>
            </Button>
          </div>
        </Reveal>

        {incomplete && (
          <Reveal className="mt-8 flex flex-col gap-3 rounded-2xl border border-sun/40 bg-sun/10 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 size-5 shrink-0 text-sun-foreground dark:text-sun" />
              <div>
                <p className="font-semibold">Complete your profile</p>
                <p className="text-sm text-muted-foreground">Add your target exam, university and state for relevant content.</p>
              </div>
            </div>
            <Button variant="leaf" onClick={() => setEditing(true)}>
              Complete profile
            </Button>
          </Reveal>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_340px]">
          <div className="grid gap-6">
            <Reveal className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="font-sans text-lg font-semibold tracking-normal">Performance</h2>
                <StatusBadge status="soon" label="Tracking starts with the quiz portal" />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-4">
                {stats.map(({ label, icon: Icon }) => (
                  <div key={label} className="rounded-2xl bg-muted/60 p-4">
                    <Icon className="size-5 text-primary" />
                    <p className="mt-3 font-display text-3xl font-semibold" aria-label={`${label}: no data yet`}>
                      —
                    </p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <div className="grid gap-6 md:grid-cols-2">
              <Reveal className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
                <h2 className="mb-4 font-sans text-lg font-semibold tracking-normal">Quiz history</h2>
                <EmptyState
                  icon={ClipboardList}
                  title="No tests yet"
                  description="Your attempts, scores and explanations will appear here once the quiz portal opens."
                />
              </Reveal>
              <Reveal delay={80} className="rounded-3xl border border-border bg-card p-5 shadow-soft sm:p-6">
                <h2 className="mb-4 font-sans text-lg font-semibold tracking-normal">Bookmarked questions</h2>
                <EmptyState
                  icon={Bookmark}
                  title="No bookmarks yet"
                  description="Save tricky questions during a test to revise them here later."
                />
              </Reveal>
            </div>
          </div>

          <Reveal delay={100} className="h-fit rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <h2 className="font-sans text-lg font-semibold tracking-normal">My profile</h2>
              <Button variant="ghost" size="sm" onClick={() => setEditing(true)} className="rounded-full">
                <Pencil /> Edit
              </Button>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <span className="grid size-12 place-items-center rounded-full bg-gradient-primary font-display text-lg font-semibold text-primary-foreground">
                {(profile?.full_name || user.email || "?").charAt(0).toUpperCase()}
              </span>
              <div className="min-w-0">
                <p className="truncate font-semibold">{profile?.full_name || "Add your name"}</p>
                <p className="truncate text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <dl className="mt-6 grid gap-4 text-sm">
              <ProfileRow icon={Target} label="Target exam" value={profile?.target_exam} />
              <ProfileRow icon={GraduationCap} label="University" value={profile?.university} />
              <ProfileRow icon={MapPin} label="State" value={profile?.state} />
              <ProfileRow icon={Phone} label="Phone" value={profile?.phone} />
            </dl>
          </Reveal>
        </div>
      </div>

      <EditProfileDialog
        open={editing}
        onOpenChange={setEditing}
        userId={user.id}
        initial={{
          full_name: profile?.full_name ?? "",
          target_exam: profile?.target_exam ?? "",
          university: profile?.university ?? "",
          state: profile?.state ?? "",
          phone: profile?.phone ?? "",
        }}
      />
    </div>
  );
}

function ProfileRow({ icon: Icon, label, value }: { icon: typeof Target; label: string; value?: string | null | undefined }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
      <div className="min-w-0">
        <dt className="text-xs uppercase tracking-wider text-muted-foreground">{label}</dt>
        <dd className={value ? "font-medium" : "text-muted-foreground"}>{value || "Not added"}</dd>
      </div>
    </div>
  );
}

function EditProfileDialog({
  open,
  onOpenChange,
  userId,
  initial,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  userId: string;
  initial: ProfileValues;
}) {
  const queryClient = useQueryClient();
  const [values, setValues] = useState<ProfileValues>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileValues, string>>>({});

  const mutation = useMutation({
    mutationFn: async (v: ProfileValues) => {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: v.full_name.trim(),
          target_exam: v.target_exam,
          university: v.university.trim(),
          state: v.state,
          phone: v.phone.trim() || null,
        })
        .eq("id", userId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Profile saved");
      void queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      onOpenChange(false);
    },
    onError: () => toast.error("Couldn't save your profile. Please try again."),
  });

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const parsed = profileSchema.safeParse(values);
    if (!parsed.success) return setErrors(toFieldErrors<keyof ProfileValues>(parsed.error.issues));
    setErrors({});
    mutation.mutate(values);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (o) setValues(initial);
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Edit profile</DialogTitle>
          <DialogDescription>Keep your details up to date for relevant content.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="grid gap-4" noValidate>
          <ProfileFields values={values} onChange={(p) => setValues((v) => ({ ...v, ...p }))} errors={errors} idPrefix="ep" />
          <Button type="submit" variant="hero" size="lg" disabled={mutation.isPending}>
            {mutation.isPending && <Loader2 className="animate-spin" />} Save changes
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
