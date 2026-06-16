import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getPublicImageUrl } from "@/lib/images";
import heroSofaDefault from "@/assets/hero-sofa.jpg";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { normalizeCollection, productCollections } from "@/lib/collections";

export const Route = createFileRoute("/collection/")({
  head: () => ({
    meta: [
      { title: "The Collection — Colne Sofa LTD" },
      { name: "description", content: "Browse our full range of hand-crafted sofas." },
    ],
  }),
  component: CollectionPage,
});

function CollectionPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [productsRes, contentRes] = await Promise.all([
        supabase.from("sofas").select("*").order("created_at", { ascending: false }),
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

  const collectionTitle = content?.collection_title || "Six silhouettes, infinite combinations.";
  const collectionDescription =
    content?.collection_description ||
    "Every model is available in over 80 fabrics and leathers, with custom dimensions on request. Pieces ship in 8–16 weeks.";

  const collectionImage = content?.collection_image || heroSofaDefault;

  const productsByCollection = productCollections.map((collection) => ({
    ...collection,
    products: products.filter(
      (product) => normalizeCollection(product.category) === collection.value,
    ),
  }));
  const totalProducts = productsByCollection.reduce(
    (total, collection) => total + collection.products.length,
    0,
  );

  return (
    <div className="bg-background pb-24">
      <section className="relative isolate overflow-hidden border-b border-primary/15">
        <img
          src={getPublicImageUrl(collectionImage)}
          alt="Colne Sofa LTD collection"
          width={1920}
          height={1080}
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/92 to-background/25" />
        <div className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-10 lg:py-32">
          <header className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              The Collection
            </p>
            <h1 className="mt-6 font-display text-4xl leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
              {collectionTitle}
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-[#555555] sm:text-lg">
              {collectionDescription}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/quote"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-primary px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-accent sm:px-7 sm:tracking-[0.2em]"
              >
                Request a Quote
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <Link
                to="/repair-request"
                className="inline-flex items-center justify-center rounded-sm bg-secondary px-6 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-secondary-foreground transition-colors hover:bg-[#142857] sm:px-7 sm:tracking-[0.2em]"
              >
                Repair Request
              </Link>
            </div>
          </header>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 pt-20 lg:px-10">

        {totalProducts > 0 ? (
          <div className="mt-20 space-y-20">
            {productsByCollection.map((collection) => (
              <section
                key={collection.value}
                id={collection.value.toLowerCase().replace(/\s+/g, "-")}
              >
                <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-primary/20 pb-5">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                      {collection.products.length} pieces
                    </p>
                    <h2 className="mt-2 font-display text-3xl text-foreground sm:text-4xl">
                      {collection.label}
                    </h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#555555]">
                      {collection.description}
                    </p>
                  </div>
                </div>

                {collection.products.length > 0 ? (
                  <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                    {collection.products.map((product) => (
                      <Link
                        key={product.id}
                        to="/collection/$slug"
                        params={{ slug: product.slug }}
                        className="group rounded-sm border border-primary/20 bg-card p-3 shadow-[0_16px_45px_rgba(11,27,58,0.06)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/55 hover:shadow-[0_22px_55px_rgba(11,27,58,0.1)]"
                      >
                        <div className="aspect-[4/5] overflow-hidden bg-muted">
                          <img
                            src={getPublicImageUrl(product.image_url)}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </div>
                        <div className="mt-6 space-y-4 px-1 pb-2">
                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <span className="rounded-sm border border-primary/20 bg-primary/10 px-2 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                              {normalizeCollection(product.category)}
                            </span>
                            <p className="text-sm font-semibold text-primary">{product.price}</p>
                          </div>
                          <div>
                            <h3 className="font-display text-2xl italic">{product.name}</h3>
                            {getProductMeta(product) && (
                              <p className="mt-1 text-xs uppercase tracking-widest text-muted-foreground">
                                {getProductMeta(product)}
                              </p>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-[#555555] line-clamp-2">
                            {product.description}
                          </p>
                          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-secondary transition-colors group-hover:text-primary">
                            View details
                            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-sm border border-dashed border-primary/25 bg-card/60 px-6 py-10 text-sm text-muted-foreground">
                    No products in {collection.label} yet. Add one from the admin product form.
                  </div>
                )}
              </section>
            ))}
          </div>
        ) : (
          <div className="mt-24 py-20 text-center border rounded-sm border-dashed">
            <p className="text-muted-foreground">
              No products found. Start adding them in the Admin Panel!
            </p>
          </div>
        )}
      </div>
    </div>
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
