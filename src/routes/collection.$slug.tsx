import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getPublicImageUrl } from "@/lib/images";
import { ArrowLeft, ArrowUpRight, Loader2 } from "lucide-react";
import { getCollectionLabel } from "@/lib/collections";

export const Route = createFileRoute("/collection/$slug")({
  component: SofaDetailPage,
});

function SofaDetailPage() {
  const { slug } = Route.useParams();
  const [sofa, setSofa] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSofa() {
      const { data } = await supabase.from("sofas").select("*").eq("slug", slug).single();

      if (data) {
        setSofa(data);
      }
      setLoading(false);
    }
    fetchSofa();
  }, [slug]);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  if (!sofa)
    return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;

  return (
    <div className="bg-background pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Link
          to="/collection"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#555555] transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Collection
        </Link>

        <div className="mt-12 grid gap-16 lg:grid-cols-2 lg:items-start">
          {/* Image Gallery */}
          <div className="aspect-[4/5] overflow-hidden border border-primary/25 bg-card p-3 shadow-[0_16px_45px_rgba(11,27,58,0.06)] lg:sticky lg:top-32">
            <img
              src={getPublicImageUrl(sofa.image_url)}
              alt={sofa.name}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="eyebrow">{getCollectionLabel(sofa.category)}</p>
            <h1 className="mt-4 font-display text-5xl italic sm:text-6xl">{sofa.name}</h1>
            <p className="mt-6 text-2xl font-semibold text-primary">{sofa.price}</p>

            <div className="mt-12 space-y-8 border-t border-border/60 pt-10">
              <p className="text-lg leading-relaxed text-[#555555]">{sofa.description}</p>

              {/* DIMENSIONS */}
              <div className="grid grid-cols-3 gap-8 py-6 border-y border-border/40">
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    Width
                  </p>
                  <p className="font-display text-xl">{sofa.width || "-"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    Depth
                  </p>
                  <p className="font-display text-xl">{sofa.depth || "-"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">
                    Height
                  </p>
                  <p className="font-display text-xl">{sofa.height || "-"}</p>
                </div>
              </div>

              {/* MATERIALS */}
              <div>
                <h4 className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold mb-4">
                  Materials
                </h4>
                <ul className="space-y-2">
                  {(sofa.materials
                    ? sofa.materials.split(",")
                    : ["Solid hardwood frame", "Hand-tied springs", "Ethically sourced fill"]
                  ).map((m: string) => (
                    <li key={m} className="flex items-center gap-3 text-sm text-[#555555]">
                      <span className="h-1 w-1 rounded-full bg-primary" />
                      {m.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/quote"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground transition-colors hover:bg-accent sm:flex-none"
              >
                Request a Quote
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
