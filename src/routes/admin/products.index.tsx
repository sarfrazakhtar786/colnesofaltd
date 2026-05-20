import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { getPublicImageUrl } from "@/lib/images";
import { Plus, Edit, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getCollectionLabel } from "@/lib/collections";

export const Route = createFileRoute("/admin/products/")({
  component: AdminProducts,
});

function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const { data, error } = await supabase
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
        ) : (
          <div className="border rounded-md overflow-hidden bg-background">
            <table className="w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">Image</th>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Collection</th>
                  <th className="px-4 py-3 text-left font-medium">Price</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {products.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-3">
                      <img
                        src={getPublicImageUrl(product.image_url)}
                        alt={product.name}
                        className="h-12 w-12 object-cover rounded border"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium">{product.name}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-sm border border-primary/25 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                        {getCollectionLabel(product.category)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{product.price}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to="/admin/products/$id"
                          params={{ id: product.id }}
                          className="p-2 hover:bg-muted rounded-md transition-colors"
                        >
                          <Edit className="h-4 w-4 text-muted-foreground" />
                        </Link>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="p-2 hover:bg-muted rounded-md transition-colors text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
