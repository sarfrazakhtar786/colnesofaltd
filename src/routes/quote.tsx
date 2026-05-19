import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { sofas, getSofa } from "@/data/sofas";
import { useState } from "react";

const searchSchema = z.object({
  sofa: z.string().optional(),
});

export const Route = createFileRoute("/quote")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Request a Custom Quote — Colne Sofa LTD" },
      {
        name: "description",
        content:
          "Tell us about your project and we'll prepare a custom sofa quote within two business days.",
      },
      { property: "og:title", content: "Request a Custom Quote — Colne Sofa LTD" },
      { property: "og:description", content: "Bespoke sofas, made to your dimensions and fabric." },
    ],
  }),
  component: QuotePage,
});

function QuotePage() {
  const { sofa } = Route.useSearch();
  const preset = sofa ? getSofa(sofa) : undefined;
  const [sent, setSent] = useState(false);

  return (
    <section className="mx-auto max-w-5xl px-6 py-24 lg:px-10">
      <p className="eyebrow">Custom Order</p>
      <h1 className="mt-5 text-balance font-display text-5xl leading-[1.05] sm:text-6xl">
        Request a quote.
        <br />
        <span className="italic text-primary">We&apos;ll reply within 48 hours.</span>
      </h1>
      <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-[#555555]">
        Tell us about the sofa, the room, the fabric you have in mind. The more details, the more
        accurate our quote and sketch.
      </p>

      {sent ? (
        <div className="mt-16 rounded-sm border border-primary/30 bg-primary/5 p-12 text-center">
          <h2 className="font-display text-4xl">Request received.</h2>
          <p className="mt-4 text-[#555555]">
            One of our designers will contact you within two business days with a quote and an
            initial sketch.
          </p>
        </div>
      ) : (
        <form
          className="mt-16 grid gap-8"
          onSubmit={(e) => {
            e.preventDefault();
            setSent(true);
          }}
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="First name" name="firstName" required />
            <Field label="Last name" name="lastName" required />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Email" name="email" type="email" required />
            <Field label="Phone" name="phone" type="tel" />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">
              Sofa model
            </label>
            <select
              name="model"
              defaultValue={preset?.slug ?? ""}
              className="mt-2 w-full border-b border-border bg-transparent py-3 text-base outline-none transition-colors focus:border-primary"
            >
              <option value="">No preference / I&apos;m not sure yet</option>
              {sofas.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name} — {s.type}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              label="Preferred fabric or leather"
              name="fabric"
              placeholder="e.g. cognac leather, sage linen"
            />
            <Field
              label="Approximate dimensions"
              name="dimensions"
              placeholder="e.g. 240 × 95 cm"
            />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">
              Project details
            </label>
            <textarea
              name="details"
              rows={6}
              required
              defaultValue={preset ? `I'm interested in the ${preset.name} (${preset.size}). ` : ""}
              className="mt-2 w-full border-b border-border bg-transparent py-3 text-base outline-none transition-colors focus:border-primary"
              placeholder="Tell us about the room, your timeline, and anything specific you have in mind."
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Delivery city" name="city" />
            <Field label="Desired timeline" name="timeline" placeholder="e.g. before December" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-8">
            <p className="text-xs text-muted-foreground">
              Your information is kept private and used only for this quote.
            </p>
            <button
              type="submit"
              className="rounded-sm bg-primary px-10 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-accent"
            >
              Submit Request
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
        {required && " *"}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full border-b border-border bg-transparent py-3 text-base outline-none transition-colors focus:border-primary placeholder:text-muted-foreground/50"
      />
    </div>
  );
}
