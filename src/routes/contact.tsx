import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { contactDetails } from "@/lib/contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact - Colne Sofa LTD" },
      {
        name: "description",
        content: "Visit Colne Sofa LTD or get in touch with the team.",
      },
      { property: "og:title", content: "Contact - Colne Sofa LTD" },
      { property: "og:description", content: "Reach the Colne Sofa LTD team." },
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
            <p className="mt-3 flex items-start gap-3 text-[#555555]">
              <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <span>
                {contactDetails.addressLines.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </p>
            <p className="mt-3 text-sm text-muted-foreground">{contactDetails.hours}</p>
          </div>
          <div>
            <p className="eyebrow">Email</p>
            <p className="mt-3 flex items-center gap-3 text-[#555555]">
              <Mail className="h-5 w-5 text-primary" />
              <a href={`mailto:${contactDetails.email}`} className="hover:text-primary">
                {contactDetails.email}
              </a>
            </p>
          </div>
          <div>
            <p className="eyebrow">Phone</p>
            <p className="mt-3 flex items-center gap-3 text-[#555555]">
              <Phone className="h-5 w-5 text-primary" />
              <a href={contactDetails.phoneHref} className="hover:text-primary">
                {contactDetails.phoneDisplay}
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
              <p className="mt-3 text-[#555555]">
                We&apos;ll be in touch within two business days.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2">
                <Field label="First name" name="firstName" placeholder="First name" />
                <Field label="Last name" name="lastName" placeholder="Last name" />
              </div>
              <Field label="Email" name="email" type="email" placeholder="you@example.com" />
              <Field label="Subject" name="subject" placeholder="Custom sofa enquiry" />
              <div>
                <label className="text-xs uppercase tracking-widest text-muted-foreground">
                  Message
                </label>
                <textarea
                  required
                  rows={6}
                  className="mt-2 w-full rounded-sm border border-border bg-white px-4 py-3 text-base shadow-sm outline-none transition-colors placeholder:text-muted-foreground/55 focus:border-primary focus:ring-2 focus:ring-primary/15"
                  placeholder="Tell us what you are looking for..."
                />
              </div>
              <button
                type="submit"
                className="mt-4 rounded-sm bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-accent"
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

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
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
        placeholder={placeholder}
        className="mt-2 w-full rounded-sm border border-border bg-white px-4 py-3 text-base shadow-sm outline-none transition-colors placeholder:text-muted-foreground/55 focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </div>
  );
}
