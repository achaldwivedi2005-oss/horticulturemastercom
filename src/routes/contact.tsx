import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { SocialCards } from "@/components/site/SocialLinks";
import { StatusBadge } from "@/components/site/StatusBadge";
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
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="We'd love to hear from you"
        description="Questions about exams, content suggestions or feedback on the platform — reach out anytime."
      />
      <section className="container-page grid gap-8 py-14 md:py-20 lg:grid-cols-[1.1fr_1fr]">
        <Reveal className="rounded-3xl border border-border bg-card p-6 shadow-soft sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-2xl font-semibold">Send a message</h2>
            <StatusBadge status="soon" label="Form opens in Stage 2" />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Message delivery is being connected. Until then, please reach us through the community channels.
          </p>
          <form className="mt-6 grid gap-4" onSubmit={(e) => e.preventDefault()} aria-describedby="form-status">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your name" disabled />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="you@example.com" disabled />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="message">Message</Label>
              <Textarea id="message" rows={5} placeholder="How can we help?" disabled />
            </div>
            <Button type="submit" variant="hero" size="lg" disabled className="justify-self-start">
              Send message
            </Button>
            <p id="form-status" className="sr-only">
              The contact form is not active yet.
            </p>
          </form>
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
