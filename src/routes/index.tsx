import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getPublicImageUrl } from "@/lib/images";
import heroSofaDefault from "@/assets/hero-sofa.jpg";
import craftsman from "@/assets/craftsman.jpg";
import { ArrowUpRight, Loader2, Ruler, ShieldCheck, Sparkles } from "lucide-react";
import { normalizeCollection } from "@/lib/collections";

const trustPoints = [
  {
    title: "Made in the UK",
    description: "Built by skilled upholsterers with proper workshop finishing.",
    icon: ShieldCheck,
  },
  {
    title: "Custom sizes",
    description: "Adjust dimensions, fabric, colour, and layout for your room.",
    icon: Ruler,
  },
  {
    title: "Premium materials",
    description: "Hardwood frames, refined fabrics, and sofa-grade cushioning.",
    icon: Sparkles,
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Colne Sofa LTD — Hand-crafted Sofas, Made to Order" },
      {
        name: "description",
        content:
          "UK-made sofas, beds, and repair services from Colne Sofa LTD. Explore the collection or request support.",
      },
      { property: "og:title", content: "Colne Sofa LTD" },
      { property: "og:description", content: "UK sofa specialists for custom furniture and repairs." },
    ],
  }),
  component: HomePage,
});

function HomePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [productsRes, contentRes] = await Promise.all([
        supabase.from("sofas").select("*").limit(3),
        supabase.from("site_settings").select("*").eq("key", "site_content").single(),
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (contentRes.data) setContent(contentRes.data.value);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  const heroTitle = content?.hero_title || "Sofas built the slow way, to be lived in for decades.";
  const heroSubtitle =
    content?.hero_subtitle ||
    "Each piece is made with care, practical comfort, and dimensions tailored for your home. Custom sofas, beds, and repair support across the UK.";
  const heroImage = content?.hero_image || heroSofaDefault;

  return (
    <>
      {/* HERO BANNER */}
      <section className="relative isolate overflow-hidden bg-background">
        <img
          src={getPublicImageUrl(heroImage)}
          alt="The Luna Curve sofa"
          width={1920}
          height={1280}
          className="absolute inset-y-0 right-0 -z-10 h-full w-full object-cover opacity-90 lg:w-[62%]"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/92 via-45% to-background/20" />

        <div className="mx-auto grid min-h-[78svh] max-w-7xl grid-cols-1 items-center px-6 py-20 sm:py-24 lg:min-h-[82vh] lg:px-10">
          <div className="max-w-2xl">
            <p className="eyebrow">Colne Sofa LTD</p>
            <h1 className="mt-6 text-balance font-display text-4xl leading-[1.06] text-foreground sm:text-6xl lg:text-7xl">
              {heroTitle}
            </h1>
            <p className="mt-7 max-w-lg text-pretty text-base leading-relaxed text-[#555555] sm:text-lg">
              {heroSubtitle}
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
              <Link
                to="/collection"
                className="group inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground shadow-sm transition-all hover:bg-accent sm:px-7 sm:tracking-[0.2em]"
              >
                See the Collection
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/repair-request"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-secondary px-6 py-4 text-center text-xs font-semibold uppercase tracking-[0.14em] text-secondary-foreground transition-colors hover:bg-[#142857] sm:px-7 sm:tracking-[0.2em]"
              >
                Repair Request
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST POINTS */}
      <section className="border-y border-primary/15 bg-white">
        <div className="mx-auto grid max-w-7xl gap-0 px-6 py-5 sm:grid-cols-3 lg:px-10">
          {trustPoints.map((point) => {
            const Icon = point.icon;

            return (
              <div
                key={point.title}
                className="flex gap-4 border-primary/15 py-5 sm:px-5 sm:first:pl-0 sm:not(:last-child):border-r"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold uppercase tracking-widest text-secondary">
                    {point.title}
                  </h2>
                  <p className="mt-2 text-sm leading-relaxed text-[#555555]">
                    {point.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* PHILOSOPHY */}
      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow">Our Philosophy</p>
            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
              We believe a sofa should outlive its trend.
            </h2>
          </div>
          <div className="space-y-6 text-pretty text-base leading-relaxed text-[#555555] lg:col-span-6 lg:col-start-7">
            <p>
              Colne Sofa LTD is a UK-based furniture specialist focused on made-to-order sofas,
              beds, and repair services. Our work is built around practical comfort, reliable
              materials, and careful finishing for real homes.
            </p>
            <p>
              {content?.about_text ||
                "Every frame is solid hardwood, every spring is hand-tied, and every cushion is filled in-house. We make fewer than 400 sofas a year so that each one receives the attention it deserves."}
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED COLLECTION */}
      <section className="bg-muted/45 py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Featured</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">From the Collection</h2>
            </div>
            <Link
              to="/collection"
              className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-primary"
            >
              View All
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {products.length > 0 ? (
              products.map((s) => (
                <Link
                  key={s.id}
                  to="/collection/$slug"
                  params={{ slug: s.slug }}
                  className="group block rounded-sm border border-primary/20 bg-card p-3 shadow-[0_16px_45px_rgba(11,27,58,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/55 hover:shadow-[0_22px_55px_rgba(11,27,58,0.1)]"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={getPublicImageUrl(s.image_url)}
                      alt={s.name}
                      width={1280}
                      height={1024}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-5 space-y-3 px-1 pb-1">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <span className="rounded-sm border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                        {normalizeCollection(s.category)}
                      </span>
                      <span className="text-sm font-semibold text-primary">{s.price}</span>
                    </div>
                    <div>
                      <h3 className="font-display text-2xl">{s.name}</h3>
                      {getProductMeta(s) && (
                        <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                          {getProductMeta(s)}
                        </p>
                      )}
                    </div>
                    <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-secondary transition-colors group-hover:text-primary">
                      View details
                      <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-muted-foreground italic col-span-3">
                No products featured yet. Add some in the Admin panel!
              </p>
            )}
          </div>
        </div>
      </section>

      {/* CRAFTSMANSHIP */}
      <section className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <div className="aspect-[4/5] overflow-hidden">
            <img
              src={craftsman}
              alt="A craftsman hand-stitching a sofa cushion in the workshop"
              width={1280}
              height={1024}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">Craftsmanship</p>
            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
              Fourteen pairs of hands.
              <br />
              <span className="italic text-primary">One sofa at a time.</span>
            </h2>
            <p className="mt-6 text-pretty leading-relaxed text-[#555555]">
              From the first cut of beech to the final hand-stitched seam, every Colne Sofa LTD sofa
              passes through fourteen artisans over an average of 84 hours of work.
            </p>
            <dl className="mt-10 grid gap-6 border-t border-border/60 pt-8 sm:grid-cols-3">
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">Founded</dt>
                <dd className="mt-2 font-display text-3xl">1978</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                  Pieces / year
                </dt>
                <dd className="mt-2 font-display text-3xl">400</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                  Frame warranty
                </dt>
                <dd className="mt-2 font-display text-3xl">Life</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-10">
        <div className="rounded-sm bg-[#111111] px-8 py-20 text-center text-white sm:px-16 sm:py-28">
          <p className="eyebrow text-primary">Bespoke</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-balance font-display text-4xl leading-tight text-white sm:text-5xl">
            Have something specific in mind?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-white/70">
            Tell us about the room, the fabric, the dimensions. We&apos;ll come back within two days
            with a quote and a sketch.
          </p>
          <Link
            to="/quote"
            className="mt-10 inline-flex items-center gap-2 rounded-sm bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-accent"
          >
            Request a Quote
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}

function getProductMeta(product: any) {
  const dimensions =
    product.width && product.depth
      ? `${product.width} W x ${product.depth} D${product.height ? ` x ${product.height} H` : ""}`
      : "";
  const material = product.materials?.split(",")[0]?.trim() || "";

  return [dimensions, material].filter(Boolean).join(" · ");
}
