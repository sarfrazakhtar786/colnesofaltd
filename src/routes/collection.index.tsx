import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

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
        supabase.from('sofas').select('*').order('created_at', { ascending: false }),
        supabase.from('site_settings').select('*').eq('key', 'site_content').single()
      ]);
      
      if (productsRes.data) setProducts(productsRes.data);
      if (contentRes.data) setContent(contentRes.data.value);
      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-primary" /></div>;

  const collectionTitle = content?.collection_title || "Six silhouettes, infinite combinations.";
  const collectionDescription = content?.collection_description || "Every model is available in over 80 fabrics and leathers, with custom dimensions on request. Pieces ship in 8–16 weeks.";

  return (
    <div className="bg-background pt-32 pb-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <header className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.2em] text-primary font-semibold">The Collection</p>
          <h1 className="mt-8 font-display text-4xl leading-[1.1] text-foreground sm:text-5xl lg:text-6xl">
            {collectionTitle}
          </h1>
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-foreground/60">
            {collectionDescription}
          </p>
        </header>

        <div className="mt-24 grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
          {products.length > 0 ? products.map((sofa) => (
            <Link 
              key={sofa.id} 
              to="/collection/$slug" 
              params={{ slug: sofa.slug }} 
              className="group"
            >
              <div className="aspect-[4/5] overflow-hidden bg-muted">
                <img
                  src={sofa.image_url}
                  alt={sofa.name}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="mt-6">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-2xl italic">{sofa.name}</h3>
                  <p className="text-sm font-medium text-foreground/60">{sofa.price}</p>
                </div>
                <p className="mt-2 text-sm text-foreground/50 line-clamp-2">{sofa.description}</p>
              </div>
            </Link>
          )) : (
            <div className="col-span-full py-20 text-center border rounded-sm border-dashed">
              <p className="text-muted-foreground">No products found. Start adding them in the Admin Panel!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
