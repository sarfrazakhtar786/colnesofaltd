import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import { getPublicImageUrl } from "@/lib/images";
import {
  AlertTriangle,
  ArrowUpRight,
  FileText,
  Loader2,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

type AdminProduct = {
  id: string;
  slug: string;
  name: string;
  price: string | null;
  description: string | null;
  image_url: string | null;
  category: string | null;
  created_at: string | null;
  width: string | null;
  depth: string | null;
  height: string | null;
  materials: string | null;
};

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [contentReady, setContentReady] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    setLoading(true);
    setError("");

    const [productsRes, contentRes] = await Promise.all([
      supabase
        .from("sofas")
        .select("id, slug, name, price, description, image_url, category, created_at, width, depth, height, materials")
        .order("created_at", { ascending: false }),
      supabase.from("site_settings").select("key").eq("key", "site_content").maybeSingle(),
    ]);

    if (productsRes.error) {
      setError(productsRes.error.message);
    } else {
      setProducts(productsRes.data || []);
    }

    setContentReady(Boolean(contentRes.data));
    setLoading(false);
  }

  const incompleteProducts = useMemo(
    () =>
      products
        .map((product) => {
          const missing = [
            !product.image_url && "image",
            !product.description && "description",
            !product.price && "price",
            (!product.width || !product.depth || !product.height) && "dimensions",
            !product.materials && "materials",
          ].filter(Boolean) as string[];

          return { product, missing };
        })
        .filter((item) => item.missing.length > 0),
    [products],
  );

  const recentProducts = products.slice(0, 5);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-display">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Live store health, recent products, and common content tasks.
          </p>
        </div>
        <Button asChild variant="outline">
          <a href="/" target="_blank" rel="noreferrer">
            View Website <ArrowUpRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          Dashboard data could not load: {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{products.length}</div>
            <p className="text-xs text-muted-foreground">Loaded from Supabase</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contentReady ? "Ready" : "Default"}</div>
            <p className="text-xs text-muted-foreground">
              {contentReady ? "Custom content saved" : "Using fallback content"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Product Warnings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{incompleteProducts.length}</div>
            <p className="text-xs text-muted-foreground">Products need more detail</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Editable Areas</CardTitle>
            <Sparkles className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4</div>
            <p className="text-xs text-muted-foreground">Hero, collection, about, products</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2">
            <Link
              to="/admin/products/new"
              className="rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-accent"
            >
              Add New Product
            </Link>
            <Link
              to="/admin/content"
              className="rounded-md border px-4 py-2 text-center text-sm font-medium transition-colors hover:border-primary hover:text-primary"
            >
              Edit Site Content
            </Link>
            <Link
              to="/admin/products"
              className="rounded-md border px-4 py-2 text-center text-sm font-medium transition-colors hover:border-primary hover:text-primary"
            >
              Manage Products
            </Link>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            {recentProducts.length ? (
              <div className="divide-y">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                    <div className="h-14 w-16 overflow-hidden rounded-sm border bg-muted">
                      {product.image_url ? (
                        <img
                          src={getPublicImageUrl(product.image_url)}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-muted-foreground">
                          <ShoppingBag className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.category || "Sofa"} {product.price ? `- ${product.price}` : ""}
                      </p>
                    </div>
                    <Link
                      to="/admin/products/$id"
                      params={{ id: product.id }}
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Edit
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No products found yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Data Warnings</CardTitle>
        </CardHeader>
        <CardContent>
          {incompleteProducts.length ? (
            <div className="space-y-3">
              {incompleteProducts.slice(0, 6).map(({ product, missing }) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-2 rounded-md border bg-muted/30 px-4 py-3 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Missing: {missing.join(", ")}
                    </p>
                  </div>
                  <Link
                    to="/admin/products/$id"
                    params={{ id: product.id }}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Fix product
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">All products have the main details filled.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
