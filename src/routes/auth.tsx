import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, MailCheck, ArrowLeft } from "lucide-react";
import nurseryPhoto from "@/assets/nursery_seedlings.jpg.asset.json";
const heroImage = nurseryPhoto.url;
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { safeRedirect, useAuth } from "@/hooks/use-auth";
import { signUpSchema } from "@/lib/profile-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogoMark } from "@/components/site/Logo";
import { FieldError, ProfileFields, emptyProfile, toFieldErrors, type ProfileValues } from "@/components/account/ProfileFields";
import { cn } from "@/lib/utils";

const searchSchema = z.object({
  mode: z.enum(["signin", "signup", "forgot"]).optional(),
  redirect: z.string().optional(),
});

export const Route = createFileRoute("/auth")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Sign in or create your account — Horticulture Master" },
      { name: "description", content: "Create a free student account to track quiz scores, accuracy and bookmarked questions." },
      { property: "og:title", content: "Join Horticulture Master" },
      { property: "og:description", content: "Free student accounts for CUET-PG, ICAR JRF/SRF and ASRB NET aspirants." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

const REDIRECT_KEY = "hm-post-auth";

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const mode = search.mode ?? "signin";

  // Already signed in (including after returning from Google) → go to destination.
  useEffect(() => {
    if (!user) return;
    let target = search.redirect;
    try {
      target = target ?? sessionStorage.getItem(REDIRECT_KEY) ?? undefined;
      sessionStorage.removeItem(REDIRECT_KEY);
    } catch {
      /* ignore */
    }
    navigate({ to: safeRedirect(target), replace: true });
  }, [user, search.redirect, navigate]);

  const setMode = (m: "signin" | "signup" | "forgot") =>
    navigate({ to: "/auth", search: { ...search, mode: m }, replace: true });

  return (
    <section className="container-page grid min-h-[calc(100vh-4rem)] items-center gap-10 py-10 lg:grid-cols-2">
      <div className="relative hidden h-full max-h-[720px] overflow-hidden rounded-[2rem] lg:block">
        <img src={heroImage} alt="" width={1280} height={1440} className="absolute inset-0 size-full object-cover object-right-bottom" />
        <div className="absolute inset-0 bg-gradient-to-t from-deep via-deep/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-10 text-deep-foreground">
          <LogoMark className="size-16 rounded-2xl bg-card/90 p-1.5" />
          <h2 className="mt-6 text-4xl font-semibold leading-tight">Your preparation, all in one place.</h2>
          <p className="mt-3 max-w-md text-deep-foreground/80">
            Track quiz scores, accuracy and bookmarked questions as you prepare for CUET-PG, ICAR JRF/SRF and ASRB NET.
          </p>
        </div>
      </div>

      <div className="mx-auto w-full max-w-lg">
        {mode === "forgot" ? (
          <ForgotPassword onBack={() => setMode("signin")} />
        ) : (
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
            <div className="grid grid-cols-2 gap-1 rounded-full bg-muted p-1" role="tablist">
              {(["signin", "signup"] as const).map((m) => (
                <button
                  key={m}
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => setMode(m)}
                  className={cn(
                    "rounded-full py-2 text-sm font-semibold transition-all",
                    mode === m ? "bg-card text-foreground shadow-soft" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {m === "signin" ? "Sign in" : "Create account"}
                </button>
              ))}
            </div>

            <h1 className="mt-7 text-3xl font-semibold">{mode === "signin" ? "Welcome back" : "Create your free account"}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">
              {mode === "signin" ? "Sign in to continue your preparation." : "Takes less than a minute."}
            </p>

            <GoogleButton redirect={search.redirect} label={mode === "signin" ? "Continue with Google" : "Sign up with Google"} />

            <div className="my-6 flex items-center gap-3 text-xs uppercase tracking-wider text-muted-foreground">
              <span className="h-px flex-1 bg-border" /> or with email <span className="h-px flex-1 bg-border" />
            </div>

            {mode === "signin" ? <SignInForm onForgot={() => setMode("forgot")} /> : <SignUpForm />}
          </div>
        )}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to use this platform for personal exam preparation.{" "}
          <Link to="/contact" className="underline hover:text-foreground">
            Need help?
          </Link>
        </p>
      </div>
    </section>
  );
}

function GoogleButton({ label, redirect }: { label: string; redirect?: string | undefined }) {
  const [busy, setBusy] = useState(false);
  const onClick = async () => {
    setBusy(true);
    try {
      if (redirect) sessionStorage.setItem(REDIRECT_KEY, safeRedirect(redirect));
    } catch {
      /* ignore */
    }
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}/auth`,
    });
    if (result.error) {
      toast.error("Google sign-in didn't work. Please try again.");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    setBusy(false);
  };
  return (
    <Button type="button" variant="outline" size="lg" className="mt-6 w-full rounded-full" onClick={onClick} disabled={busy}>
      {busy ? <Loader2 className="animate-spin" /> : <GoogleIcon />}
      {label}
    </Button>
  );
}

function SignInForm({ onForgot }: { onForgot: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError(undefined);
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setBusy(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (err) {
      setError(
        err.message.toLowerCase().includes("confirm")
          ? "Please confirm your email first — check your inbox for the link."
          : "Email or password is incorrect.",
      );
    }
  };

  return (
    <form onSubmit={submit} className="grid gap-4" noValidate>
      <div className="grid gap-2">
        <Label htmlFor="si-email">Email</Label>
        <Input id="si-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="si-password">Password</Label>
          <button type="button" onClick={onForgot} className="text-xs font-semibold text-primary hover:underline">
            Forgot password?
          </button>
        </div>
        <Input
          id="si-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <FieldError message={error} />
      <Button type="submit" variant="hero" size="lg" disabled={busy} className="mt-1 w-full">
        {busy && <Loader2 className="animate-spin" />} Sign in
      </Button>
    </form>
  );
}

function SignUpForm() {
  const [profile, setProfile] = useState<ProfileValues>(emptyProfile);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileValues | "email" | "password" | "form", string>>>({});
  const [busy, setBusy] = useState(false);
  const [sentTo, setSentTo] = useState<string>();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = signUpSchema.safeParse({ ...profile, email, password });
    if (!parsed.success) {
      setErrors(toFieldErrors<keyof ProfileValues | "email" | "password" | "form">(parsed.error.issues));
      return;
    }
    setErrors({});
    setBusy(true);
    const { email: em, password: pw, ...meta } = parsed.data;
    const { error } = await supabase.auth.signUp({
      email: em,
      password: pw,
      options: { emailRedirectTo: `${window.location.origin}/auth`, data: { ...meta, phone: meta.phone || null } },
    });
    setBusy(false);
    if (error) {
      setErrors({ form: error.message.includes("registered") ? "An account with this email already exists. Try signing in." : error.message });
      return;
    }
    setSentTo(em);
  };

  if (sentTo) {
    return (
      <div className="flex flex-col items-center rounded-2xl bg-secondary p-6 text-center">
        <MailCheck className="size-10 text-primary" />
        <p className="mt-4 font-semibold">Check your email</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We sent a confirmation link to <strong className="text-foreground">{sentTo}</strong>. Click it to activate your account, then sign in.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4" noValidate>
      <ProfileFields values={profile} onChange={(p) => setProfile((v) => ({ ...v, ...p }))} errors={errors} idPrefix="su" />
      <div className="grid gap-2">
        <Label htmlFor="su-email">Email</Label>
        <Input id="su-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!errors.email} />
        <FieldError message={errors.email} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="su-password">Password</Label>
        <Input
          id="su-password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={!!errors.password}
        />
        <FieldError message={errors.password ?? undefined} />
        {!errors.password && <p className="text-xs text-muted-foreground">At least 8 characters.</p>}
      </div>
      <FieldError message={errors.form} />
      <Button type="submit" variant="hero" size="lg" disabled={busy} className="mt-1 w-full">
        {busy && <Loader2 className="animate-spin" />} Create account
      </Button>
    </form>
  );
}

function ForgotPassword({ onBack }: { onBack: () => void }) {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string>();

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!z.string().email().safeParse(email.trim()).success) {
      setError("Enter a valid email.");
      return;
    }
    setBusy(true);
    await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
    setBusy(false);
    setSent(true);
  };

  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
      <button onClick={onBack} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Back to sign in
      </button>
      <h1 className="mt-6 text-3xl font-semibold">Reset your password</h1>
      {sent ? (
        <p className="mt-3 text-sm text-muted-foreground">
          If an account exists for <strong className="text-foreground">{email}</strong>, a reset link is on its way.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-6 grid gap-4" noValidate>
          <div className="grid gap-2">
            <Label htmlFor="fp-email">Email</Label>
            <Input id="fp-email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <FieldError message={error} />
          </div>
          <Button type="submit" variant="hero" size="lg" disabled={busy} className="w-full">
            {busy && <Loader2 className="animate-spin" />} Send reset link
          </Button>
        </form>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-4">
      <path fill="#4285F4" d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.4 3.62v3h3.88c2.27-2.09 3.57-5.17 3.57-8.81z" />
      <path fill="#34A853" d="M12 24c3.24 0 5.96-1.07 7.94-2.92l-3.88-3c-1.08.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.29v3.1A12 12 0 0 0 12 24z" />
      <path fill="#FBBC05" d="M5.29 14.28A7.2 7.2 0 0 1 4.91 12c0-.79.14-1.56.38-2.28v-3.1H1.29A12 12 0 0 0 0 12c0 1.94.46 3.77 1.29 5.38l4-3.1z" />
      <path fill="#EA4335" d="M12 4.77c1.76 0 3.34.61 4.59 1.8l3.44-3.44A11.98 11.98 0 0 0 12 0 12 12 0 0 0 1.29 6.62l4 3.1C6.23 6.88 8.88 4.77 12 4.77z" />
    </svg>
  );
}
