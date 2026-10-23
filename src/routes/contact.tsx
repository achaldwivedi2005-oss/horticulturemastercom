import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { contactSchema } from "@/lib/profile-schema";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { SocialCards } from "@/components/site/SocialLinks";
import { FieldError, toFieldErrors } from "@/components/account/ProfileFields";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Horticulture Master" },
      { name: "description", content: "Get in touch with the Horticulture Master team or join our learning community." },
      { property: "og:title", content: "Contact Horticulture Master" },
      { property: "og:description", content: "Questions, feedback or content suggestions — reach the Horticulture Master team." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { user } = useAuth();
  const [values, setValues] = useState({ name: "", email: "", message: "" });
  const [errors, setErrors] = useState<Partial<Record<"name" | "email" | "message" | "form", string>>>({});
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) return setErrors(toFieldErrors<"name" | "email" | "message" | "form">(parsed.error.issues));
    setErrors({});
    setBusy(true);
    const { error } = await supabase.from("contact_messages").insert({ ...parsed.data, user_id: user?.id ?? null });
    setBusy(false);
    if (error) return setErrors({ form: "Your message couldn't be sent. Please try again." });
    setSent(true);
    setValues({ name: "", email: "", message: "" });
  };

  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="We'd love to hear from you"
        description="Questions about exams, content suggestions or feedback on the platform — reach out anytime."
      />
      <section className="container-page grid gap-8 py-14 md:py-20 lg:grid-cols-[1.1fr_1fr]">
        <Reveal className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
          <h2 className="text-2xl font-semibold">Send a message</h2>
          <p className="mt-2 text-sm text-muted-foreground">Our team reads every message.</p>
          {sent ? (
            <div className="mt-6 flex flex-col items-center rounded-2xl bg-secondary p-8 text-center">
              <CheckCircle2 className="size-10 text-primary" />
              <p className="mt-4 font-semibold">Message sent — thank you!</p>
              <p className="mt-1 text-sm text-muted-foreground">We'll get back to you by email.</p>
              <Button variant="soft" className="mt-5" onClick={() => setSent(false)}>
                Send another
              </Button>
            </div>
          ) : (
            <form className="mt-6 grid gap-4" onSubmit={submit} noValidate>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    autoComplete="name"
                    maxLength={100}
                    value={values.name}
                    onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                    aria-invalid={!!errors.name}
                  />
                  <FieldError message={errors.name} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    maxLength={255}
                    value={values.email}
                    onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                    aria-invalid={!!errors.email}
                  />
                  <FieldError message={errors.email} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={5}
                  maxLength={2000}
                  placeholder="How can we help?"
                  value={values.message}
                  onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                  aria-invalid={!!errors.message}
                />
                <FieldError message={errors.message} />
              </div>
              <FieldError message={errors.form} />
              <Button type="submit" variant="hero" size="lg" disabled={busy} className="justify-self-start">
                {busy && <Loader2 className="animate-spin" />} Send message
              </Button>
            </form>
          )}
        </Reveal>
        <Reveal delay={100} className="rounded-3xl bg-gradient-deep p-6 text-deep-foreground sm:p-8">
          <h2 className="text-2xl font-semibold">Community channels</h2>
          <p className="mt-2 text-sm text-deep-foreground/75">The fastest way to get updates and ask questions.</p>
          <SocialCards className="mt-6 !grid-cols-1" />
        </Reveal>
      </section>
    </>
  );
}
