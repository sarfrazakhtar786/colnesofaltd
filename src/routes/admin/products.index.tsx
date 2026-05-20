import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getPublicImageUrl } from "@/lib/images";
import { AlertCircle, Edit, Eye, Loader2, Plus, Search, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { getCollectionLabel, normalizeCollection, productCollections } from "@/lib/collections";

type Product = {
  id: string;
  slug: string;
  name: string;
  price: string | null;
  description: string | null;
  image_url: string | null;
  category: string | null;
  width: string | null;
  depth: string | null;
  height: string | null;
  materials: string | null;
};

export const Route = createFileRoute("/admin/products/")({
  component: AdminProducts,
});

function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [collectionFilter, setCollectionFilter] = useState("all");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data } = await supabase
      .from("sofas")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setProducts(data);
    setLoading(false);
  }

  async function deleteProduct(id: string) {
    if (!confirm("Are you sure you want to delete this product?")) return;

    const { error } = await supabase.from("sofas").delete().eq("id", id);
    if (error) {
      alert("Error deleting product");
    } else {
      fetchProducts();
    }
  }

  const filteredProducts = products.filter((product) => {
    const normalizedCollection = normalizeCollection(product.category);
    const searchable = [
      product.name,
      product.slug,
      normalizedCollection,
      product.price,
      product.description,
      product.materials,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    const matchesSearch = searchable.includes(search.trim().toLowerCase());
    const matchesCollection =
      collectionFilter === "all" || normalizedCollection === collectionFilter;

    return matchesSearch && matchesCollection;
  });

  function getMissingFields(product: Product) {
    return [
      !product.image_url && "image",
      !product.price && "price",
      !product.description && "description",
      !(product.width && product.depth && product.height) && "dimensions",
      !product.materials && "materials",
    ].filter(Boolean) as string[];
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display">Manage Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2 text-sm font-medium"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <Card>
        <CardContent className="grid gap-4 p-4 md:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, slug, collection, material..."
              className="pl-9"
            />
          </div>
          <select
            value={collectionFilter}
            onChange={(e) => setCollectionFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-white px-3 text-sm shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All collections</option>
            {productCollections.map((collection) => (
              <option key={collection.value} value={collection.value}>
                {collection.label}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground md:col-span-2">
            Showing {filteredProducts.length} of {products.length} products.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              No products found. Click "Add Product" to create one.
            </CardContent>
          </Card>
        ) : filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              No products match your current search or collection filter.
            </CardContent>
          </Card>
        ) : (
          <div className="border rounded-md overflow-hidden bg-background">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Image</th>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Collection</th>
                  <th className="px-4 py-3 text-left font-medium">Price</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map((product) => {
                  const missingFields = getMissingFields(product);

                  return (
                    <tr key={product.id}>
                      <td className="px-4 py-3">
                        {product.image_url ? (
                          <img
                            src={getPublicImageUrl(product.image_url)}
                            alt={product.name}
                            className="h-12 w-12 object-cover rounded border"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded border bg-muted text-muted-foreground">
                            <AlertCircle className="h-4 w-4" />
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.slug}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded-sm border border-primary/25 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                          {getCollectionLabel(product.category)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{product.price || "-"}</td>
                      <td className="px-4 py-3">
                        {missingFields.length === 0 ? (
                          <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
                            Complete
                          </Badge>
                        ) : (
                          <div className="flex max-w-[260px] flex-wrap gap-1">
                            {missingFields.map((field) => (
                              <Badge
                                key={field}
                                variant="outline"
                                className="border-amber-200 bg-amber-50 text-amber-700"
                              >
                                Missing {field}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            to="/collection/$slug"
                            params={{ slug: product.slug }}
                            className="p-2 hover:bg-muted rounded-md transition-colors"
                            title="View live product"
                          >
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </Link>
                          <Link
                            to="/admin/products/$id"
                            params={{ id: product.id }}
                            className="p-2 hover:bg-muted rounded-md transition-colors"
                            title="Edit product"
                          >
                            <Edit className="h-4 w-4 text-muted-foreground" />
                          </Link>
                          <button
                            onClick={() => deleteProduct(product.id)}
                            className="p-2 hover:bg-muted rounded-md transition-colors text-destructive"
                            title="Delete product"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
