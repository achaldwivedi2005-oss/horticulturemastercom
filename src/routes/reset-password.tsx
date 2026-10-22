import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/account/ProfileFields";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set a new password — Horticulture Master" },
      { name: "description", content: "Choose a new password for your Horticulture Master account." },
      { property: "og:title", content: "Set a new password — Horticulture Master" },
      { property: "og:description", content: "Choose a new password for your Horticulture Master account." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string>();
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const isRecovery = window.location.hash.includes("type=recovery");
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setReady(true);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && (isRecovery || session)) setReady(true);
    });
    return () => data.subscription.unsubscribe();
  }, []);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) return setError("Use at least 8 characters.");
    if (password !== confirm) return setError("Passwords don't match.");
    setError(undefined);
    setBusy(true);
    const { error: err } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (err) return setError(err.message);
    toast.success("Password updated");
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <section className="container-page flex min-h-[70vh] items-center justify-center py-14">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
        <h1 className="text-3xl font-semibold">Set a new password</h1>
        {!ready ? (
          <p className="mt-3 text-sm text-muted-foreground">
            Open this page from the reset link in your email. If the link has expired, request a new one from the sign-in page.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 grid gap-4" noValidate>
            <div className="grid gap-2">
              <Label htmlFor="np">New password</Label>
              <Input id="np" type="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="npc">Confirm password</Label>
              <Input id="npc" type="password" autoComplete="new-password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
            </div>
            <FieldError message={error} />
            <Button type="submit" variant="hero" size="lg" disabled={busy} className="w-full">
              {busy && <Loader2 className="animate-spin" />} Update password
            </Button>
          </form>
        )}
      </div>
    </section>
  );
}
