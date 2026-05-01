import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import heroSofaDefault from "@/assets/hero-sofa.jpg";
import craftsman from "@/assets/craftsman.jpg";
import { ArrowUpRight, Loader2 } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Colne Sofa LTD — Hand-crafted Sofas, Made to Order" },
      { name: "description", content: "Bespoke sofas hand-built in our Parisian atelier. Explore the collection or request a custom quote." },
      { property: "og:title", content: "Colne Sofa LTD" },
      { property: "og:description", content: "Bespoke sofas hand-built in Paris." },
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
        supabase.from('sofas').select('*').limit(3),
        supabase.from('site_settings').select('*').eq('key', 'site_content').single()
      ]);

      if (productsRes.data) setProducts(productsRes.data);
      if (contentRes.data) setContent(contentRes.data.value);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-primary" /></div>;

  const heroTitle = content?.hero_title || "Sofas built the slow way, to be lived in for decades.";
  const heroSubtitle = content?.hero_subtitle || "Each piece is hand-cut, hand-stitched and made to your dimensions in our Parisian workshop. No warehouses. No shortcuts.";
  const heroImage = content?.hero_image || heroSofaDefault;

  return (
    <>
      {/* HERO BANNER */}
      <section className="relative isolate overflow-hidden">
        <img
          src={heroImage}
          alt="The Luna Curve sofa"
          width={1920}
          height={1280}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background/85 via-background/40 to-transparent" />

        <div className="mx-auto grid min-h-[88vh] max-w-7xl grid-cols-1 items-center px-6 py-24 lg:px-10">
          <div className="max-w-2xl">
            <p className="eyebrow">Atelier · Paris · Est. 1978</p>
            <h1 className="mt-6 text-balance font-display text-5xl leading-[1.05] text-foreground sm:text-6xl lg:text-7xl">
              {heroTitle}
            </h1>
            <p className="mt-7 max-w-lg text-pretty text-base leading-relaxed text-foreground/75 sm:text-lg">
              {heroSubtitle}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/collection"
                className="group inline-flex items-center gap-2 rounded-sm bg-foreground px-7 py-4 text-xs uppercase tracking-[0.2em] text-background transition-all hover:bg-primary"
              >
                See the Collection
                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <Link
                to="/quote"
                className="inline-flex items-center gap-2 rounded-sm border border-foreground px-7 py-4 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-foreground hover:text-background"
              >
                Request a Custom Quote
              </Link>
            </div>
          </div>
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
          <div className="space-y-6 text-pretty text-base leading-relaxed text-foreground/80 lg:col-span-6 lg:col-start-7">
            <p>
              Colne Sofa LTD was founded in 1978 by Élise Marchand, a Parisian upholsterer who refused to compromise on materials or time. Forty-six years later, our team of fourteen artisans still works the same way — by hand, in the same workshop on Rue de l&apos;Artisan.
            </p>
            <p>
              {content?.about_text || "Every frame is solid hardwood, every spring is hand-tied, and every cushion is filled in-house. We make fewer than 400 sofas a year so that each one receives the attention it deserves."}
            </p>
          </div>
        </div>
      </section>

      {/* FEATURED COLLECTION */}
      <section className="bg-secondary/40 py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Featured</p>
              <h2 className="mt-3 font-display text-4xl sm:text-5xl">From the Collection</h2>
            </div>
            <Link to="/collection" className="group inline-flex items-center gap-2 text-sm uppercase tracking-widest text-primary">
              View All
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {products.length > 0 ? products.map((s) => (
              <Link
                key={s.id}
                to="/collection/$slug"
                params={{ slug: s.slug }}
                className="group block"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={s.image_url}
                    alt={s.name}
                    width={1280}
                    height={1024}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-3">
                  <h3 className="font-display text-2xl">{s.name}</h3>
                  <span className="text-sm text-muted-foreground">{s.price}</span>
                </div>
              </Link>
            )) : (
              <p className="text-muted-foreground italic col-span-3">No products featured yet. Add some in the Admin panel!</p>
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
              alt="A craftsman hand-stitching a sofa cushion in our atelier"
              width={1280}
              height={1024}
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="eyebrow">Craftsmanship</p>
            <h2 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
              Fourteen pairs of hands.<br />
              <span className="italic text-primary">One sofa at a time.</span>
            </h2>
            <p className="mt-6 text-pretty leading-relaxed text-foreground/80">
              From the first cut of beech to the final hand-stitched seam, every Colne Sofa LTD sofa passes through fourteen artisans over an average of 84 hours of work.
            </p>
            <dl className="mt-10 grid grid-cols-3 gap-6 border-t border-border/60 pt-8">
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">Founded</dt>
                <dd className="mt-2 font-display text-3xl">1978</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">Pieces / year</dt>
                <dd className="mt-2 font-display text-3xl">400</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-widest text-muted-foreground">Frame warranty</dt>
                <dd className="mt-2 font-display text-3xl">Life</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-10">
        <div className="rounded-sm bg-foreground px-8 py-20 text-center text-background sm:px-16 sm:py-28">
          <p className="eyebrow text-background/60">Bespoke</p>
          <h2 className="mx-auto mt-4 max-w-2xl text-balance font-display text-4xl leading-tight sm:text-5xl">
            Have something specific in mind?
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-background/70">
            Tell us about the room, the fabric, the dimensions. We&apos;ll come back within two days with a quote and a sketch.
          </p>
          <Link
            to="/quote"
            className="mt-10 inline-flex items-center gap-2 rounded-sm bg-background px-8 py-4 text-xs uppercase tracking-[0.2em] text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Request a Quote
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
