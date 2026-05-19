import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — Colne Sofa LTD" },
      {
        name: "description",
        content: "Visit our Parisian showroom or get in touch with the atelier.",
      },
      { property: "og:title", content: "Contact — Colne Sofa LTD" },
      { property: "og:description", content: "Reach our Paris atelier and showroom." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [sent, setSent] = useState(false);
  return (
    <>
      <section className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <p className="eyebrow">Contact</p>
        <h1 className="mt-5 max-w-3xl text-balance font-display text-5xl leading-[1.05] sm:text-6xl">
          Come visit, or simply
          <br />
          <span className="italic text-primary">drop us a line.</span>
        </h1>
      </section>

      <section className="mx-auto grid max-w-7xl gap-16 px-6 pb-28 lg:grid-cols-12 lg:px-10">
        <aside className="space-y-10 lg:col-span-4">
          <div>
            <p className="eyebrow">Showroom</p>
            <p className="mt-3 flex items-start gap-3 text-foreground/80">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span>
                14 Rue de l&apos;Artisan
                <br />
                75011 Paris, France
              </span>
            </p>
            <p className="mt-3 text-sm text-muted-foreground">Tue–Sat · 10:00 — 19:00</p>
          </div>
          <div>
            <p className="eyebrow">Email</p>
            <p className="mt-3 flex items-center gap-3 text-foreground/80">
              <Mail className="h-5 w-5 text-primary" />
              <a href="mailto:hello@colnesofa.com" className="hover:text-primary">
                hello@colnesofa.com
              </a>
            </p>
          </div>
          <div>
            <p className="eyebrow">Phone</p>
            <p className="mt-3 flex items-center gap-3 text-foreground/80">
              <Phone className="h-5 w-5 text-primary" />
              <a href="tel:+33142000000" className="hover:text-primary">
                +33 1 42 00 00 00
              </a>
            </p>
          </div>
        </aside>

        <form
          className="space-y-6 lg:col-span-7 lg:col-start-6"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          {sent ? (
            <div className="rounded-sm border border-primary/30 bg-primary/5 p-10 text-center">
              <h2 className="font-display text-3xl">Thank you.</h2>
              <p className="mt-3 text-foreground/75">
                We&apos;ll be in touch within two business days.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="First name" name="firstName" />
                <Field label="Last name" name="lastName" />
              </div>
              <Field label="Email" name="email" type="email" />
              <Field label="Subject" name="subject" />
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">
                  Message
                </label>
                <textarea
                  required
                  rows={6}
                  className="mt-2 w-full border-b border-border bg-transparent py-3 text-base outline-none transition-colors focus:border-primary"
                />
              </div>
              <button
                type="submit"
                className="mt-4 rounded-sm bg-foreground px-8 py-4 text-xs uppercase tracking-[0.2em] text-background transition-colors hover:bg-primary"
              >
                Send Message
              </button>
            </>
          )}
        </form>
      </section>
    </>
  );
}

function Field({ label, name, type = "text" }: { label: string; name: string; type?: string }) {
  return (
    <div>
      <label htmlFor={name} className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required
        className="mt-2 w-full border-b border-border bg-transparent py-3 text-base outline-none transition-colors focus:border-primary"
      />
    </div>
  );
}
