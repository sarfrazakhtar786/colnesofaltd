import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getPublicImageUrl } from "@/lib/images";
import { ArrowLeft, ArrowUpRight, Check, Loader2 } from "lucide-react";
import { getCollectionLabel } from "@/lib/collections";

export const Route = createFileRoute("/collection/$slug")({
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { slug } = Route.useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProduct() {
      const { data } = await supabase.from("sofas").select("*").eq("slug", slug).single();

      if (data) {
        setProduct(data);
      }
      setLoading(false);
    }

    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return <div className="min-h-screen flex items-center justify-center">Product not found.</div>;
  }

  const materials = product.materials
    ? product.materials.split(",").map((item: string) => item.trim()).filter(Boolean)
    : ["Solid hardwood frame", "Hand-tied springs", "Ethically sourced fill"];

  return (
    <div className="bg-background pb-28 pt-32 md:pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <Link
          to="/collection"
          className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-[#555555] transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-3 w-3" /> Back to Collection
        </Link>

        <div className="mt-12 grid gap-16 lg:grid-cols-2 lg:items-start">
          <div className="aspect-[4/5] overflow-hidden border border-primary/25 bg-card p-3 shadow-[0_16px_45px_rgba(11,27,58,0.06)] lg:sticky lg:top-32">
            <img
              src={getPublicImageUrl(product.image_url)}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col">
            <p className="eyebrow">{getCollectionLabel(product.category)}</p>
            <h1 className="mt-4 font-display text-5xl italic sm:text-6xl">{product.name}</h1>
            <p className="mt-6 text-2xl font-semibold text-primary">{product.price}</p>

            <div className="mt-12 space-y-8 border-t border-border/60 pt-10">
              <section className="space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Overview
                </h2>
                <p className="text-lg leading-relaxed text-[#555555]">{product.description}</p>
              </section>

              <section className="rounded-sm border bg-card p-5 shadow-[0_12px_35px_rgba(11,27,58,0.05)]">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Dimensions
                </h2>
                <div className="mt-5 grid grid-cols-3 gap-5">
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                      Width
                    </p>
                    <p className="font-display text-xl">{product.width || "-"}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                      Depth
                    </p>
                    <p className="font-display text-xl">{product.depth || "-"}</p>
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">
                      Height
                    </p>
                    <p className="font-display text-xl">{product.height || "-"}</p>
                  </div>
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  Materials
                </h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {materials.map((material: string) => (
                    <li
                      key={material}
                      className="flex items-center gap-3 rounded-sm border border-primary/15 bg-card px-3 py-2 text-sm text-[#555555]"
                    >
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                      {material}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-sm bg-secondary px-5 py-6 text-secondary-foreground">
                <h2 className="font-display text-3xl text-white">Ready to customise it?</h2>
                <p className="mt-2 text-sm leading-relaxed text-white/75">
                  Send the model, room size, fabric preference and timeline. The quote form will
                  preselect this product.
                </p>
                <Link
                  to="/quote"
                  search={{ sofa: product.slug }}
                  className="mt-5 inline-flex items-center gap-2 rounded-sm bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors hover:bg-accent"
                >
                  Request a Quote
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </section>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-4 py-3 shadow-[0_-10px_30px_rgba(11,27,58,0.12)] backdrop-blur md:hidden">
        <Link
          to="/quote"
          search={{ sofa: product.slug }}
          className="flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground"
        >
          Request a Quote
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
