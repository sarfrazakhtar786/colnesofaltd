import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { contactDetails, fetchContactDetails } from "@/lib/contact";
import { normalizeCollection } from "@/lib/collections";
import { supabase } from "@/lib/supabase";
import { saveQuoteRequest } from "@/lib/submissions";

type QuoteProduct = {
  slug: string;
  name: string;
  category: string | null;
};

const searchSchema = z.object({
  sofa: z.string().optional(),
});

export const Route = createFileRoute("/quote")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Request a Custom Quote - Colne Sofa LTD" },
      {
        name: "description",
        content:
          "Tell us about your project and we'll prepare a custom sofa quote within two business days.",
      },
      { property: "og:title", content: "Request a Custom Quote - Colne Sofa LTD" },
      { property: "og:description", content: "Bespoke sofas, made to your dimensions and fabric." },
    ],
  }),
  component: QuotePage,
});

function QuotePage() {
  const { sofa } = Route.useSearch();
  const [products, setProducts] = useState<QuoteProduct[]>([]);
  const [details, setDetails] = useState(contactDetails);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    async function fetchPageData() {
      const [productsRes, contactDetailsRes] = await Promise.all([
        supabase
          .from("sofas")
          .select("slug, name, category")
          .order("category", { ascending: true })
          .order("name", { ascending: true }),
        fetchContactDetails(),
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      setDetails({ ...contactDetailsRes, phoneHref: contactDetails.phoneHref });
    }

    fetchPageData();
  }, []);

  const preset = sofa ? products.find((product) => product.slug === sofa) : undefined;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }

    const form = new FormData(e.currentTarget);
    const selectedModel = products.find((product) => product.slug === form.get("model"));
    const selectedModelLabel = selectedModel
      ? `${selectedModel.name} - ${normalizeCollection(selectedModel.category)}`
      : "No preference / not sure yet";
    const submission = {
      first_name: String(form.get("firstName") || ""),
      last_name: String(form.get("lastName") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      product_model: selectedModelLabel,
      fabric: String(form.get("fabric") || ""),
      dimensions: String(form.get("dimensions") || ""),
      city: String(form.get("city") || ""),
      timeline: String(form.get("timeline") || ""),
      details: String(form.get("details") || ""),
    };

    const message = [
      "New quote request - Colne Sofa LTD",
      "",
      `Name: ${submission.first_name} ${submission.last_name}`.trim(),
      `Email: ${submission.email}`,
      `Phone: ${submission.phone}`,
      `Product model: ${submission.product_model}`,
      `Fabric or leather: ${submission.fabric}`,
      `Approximate dimensions: ${submission.dimensions}`,
      `Delivery city: ${submission.city}`,
      `Desired timeline: ${submission.timeline}`,
      "",
      "Project details:",
      submission.details,
    ].join("\n");

    const { error } = await saveQuoteRequest(submission);
    if (error) {
      console.warn("Quote request was not saved:", error.message);
    }

    const whatsappUrl = `https://wa.me/${details.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-24 lg:px-10">
      <p className="eyebrow">Custom Order</p>
      <h1 className="mt-5 text-balance font-display text-5xl leading-[1.05] sm:text-6xl">
        Request a quote.
        <br />
        <span className="italic text-primary">We&apos;ll reply within 48 hours.</span>
      </h1>
      <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-[#555555]">
        Tell us about the sofa, bed, room, and fabric you have in mind. The more details, the more
        accurate our quote and sketch.
      </p>

      {sent ? (
        <div className="mt-16 rounded-sm border border-primary/30 bg-primary/5 p-12 text-center">
          <h2 className="font-display text-4xl">WhatsApp message prepared.</h2>
          <p className="mt-4 text-[#555555]">
            Please send the message in WhatsApp so our team can reply with your quote.
          </p>
        </div>
      ) : (
        <form className="mt-16 grid gap-8" onSubmit={handleSubmit}>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="First name" name="firstName" placeholder="First name" required />
            <Field label="Last name" name="lastName" placeholder="Last name" required />
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Email" name="email" type="email" placeholder="you@example.com" required />
            <Field label="Phone" name="phone" type="tel" placeholder="07417 556531" />
          </div>

          <div>
            <label className="text-xs uppercase tracking-widest text-muted-foreground">
              Product model
            </label>
            <select
              name="model"
              defaultValue={preset?.slug ?? ""}
              className="mt-2 w-full rounded-sm border border-border bg-white px-4 py-3 text-base shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
            >
              <option value="">No preference / I&apos;m not sure yet</option>
              {products.map((product) => (
                <option key={product.slug} value={product.slug}>
                  {product.name} - {normalizeCollection(product.category)}
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
              placeholder="e.g. 240 x 95 cm"
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
              defaultValue={preset ? `I'm interested in the ${preset.name}. ` : ""}
              className="mt-2 w-full rounded-sm border border-border bg-white px-4 py-3 text-base shadow-sm outline-none transition-colors placeholder:text-muted-foreground/55 focus:border-primary focus:ring-2 focus:ring-primary/15"
              placeholder="Tell us about the room, your timeline, and anything specific you have in mind."
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Delivery city" name="city" placeholder="e.g. Manchester" />
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
              Send on WhatsApp
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
        className="mt-2 w-full rounded-sm border border-border bg-white px-4 py-3 text-base shadow-sm outline-none transition-colors placeholder:text-muted-foreground/55 focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </div>
  );
}
