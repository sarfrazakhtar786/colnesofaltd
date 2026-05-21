import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { getPublicImageUrl } from "@/lib/images";
import { AlertCircle, Edit, Eye, Layers, Loader2, Plus, Search, Trash2 } from "lucide-react";
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [missingFilter, setMissingFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkCollection, setBulkCollection] = useState(productCollections[0]?.value || "Sofa Collection");
  const [bulkWorking, setBulkWorking] = useState(false);

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
    setSelectedIds([]);
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

  function getMissingFields(product: Product) {
    return [
      !product.image_url && "image",
      !product.price && "price",
      !product.description && "description",
      !(product.width && product.depth && product.height) && "dimensions",
      !product.materials && "materials",
    ].filter(Boolean) as string[];
  }

  const enrichedProducts = useMemo(
    () =>
      products.map((product) => ({
        product,
        normalizedCollection: normalizeCollection(product.category),
        missingFields: getMissingFields(product),
      })),
    [products],
  );

  const filteredProducts = enrichedProducts.filter(({ product, normalizedCollection, missingFields }) => {
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
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "complete" && missingFields.length === 0) ||
      (statusFilter === "needs-work" && missingFields.length > 0);
    const matchesMissing =
      missingFilter === "all" || missingFields.includes(missingFilter);

    return matchesSearch && matchesCollection && matchesStatus && matchesMissing;
  });

  const visibleProductIds = filteredProducts.map(({ product }) => product.id);
  const selectedVisibleIds = selectedIds.filter((id) => visibleProductIds.includes(id));
  const allVisibleSelected =
    visibleProductIds.length > 0 && visibleProductIds.every((id) => selectedIds.includes(id));
  const completeCount = enrichedProducts.filter((item) => item.missingFields.length === 0).length;
  const needsWorkCount = products.length - completeCount;
  const collectionCounts = productCollections.map((collection) => ({
    ...collection,
    count: enrichedProducts.filter((item) => item.normalizedCollection === collection.value).length,
  }));

  function toggleProductSelection(id: string) {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  }

  function toggleSelectVisible() {
    setSelectedIds((current) => {
      if (allVisibleSelected) {
        return current.filter((id) => !visibleProductIds.includes(id));
      }

      return Array.from(new Set([...current, ...visibleProductIds]));
    });
  }

  async function bulkUpdateCollection() {
    if (selectedIds.length === 0) return;

    const confirmed = confirm(`Move ${selectedIds.length} selected product(s) to ${bulkCollection}?`);
    if (!confirmed) return;

    setBulkWorking(true);
    const { error } = await supabase
      .from("sofas")
      .update({ category: bulkCollection })
      .in("id", selectedIds);

    if (error) {
      alert("Bulk collection update failed: " + error.message);
    } else {
      await fetchProducts();
    }
    setBulkWorking(false);
  }

  async function bulkDeleteProducts() {
    if (selectedIds.length === 0) return;

    const confirmed = confirm(`Delete ${selectedIds.length} selected product(s)? This cannot be undone.`);
    if (!confirmed) return;

    setBulkWorking(true);
    const { error } = await supabase.from("sofas").delete().in("id", selectedIds);

    if (error) {
      alert("Bulk delete failed: " + error.message);
    } else {
      await fetchProducts();
    }
    setBulkWorking(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-display">Manage Products</h1>
        <Link
          to="/admin/products/new"
          className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      <Card>
        <CardContent className="grid gap-4 p-4 lg:grid-cols-[1fr_190px_170px_190px]">
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
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-white px-3 text-sm shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All statuses</option>
            <option value="complete">Complete</option>
            <option value="needs-work">Needs work</option>
          </select>
          <select
            value={missingFilter}
            onChange={(e) => setMissingFilter(e.target.value)}
            className="h-10 rounded-md border border-input bg-white px-3 text-sm shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="all">All missing fields</option>
            <option value="image">Missing image</option>
            <option value="price">Missing price</option>
            <option value="description">Missing description</option>
            <option value="dimensions">Missing dimensions</option>
            <option value="materials">Missing materials</option>
          </select>
          <p className="text-xs text-muted-foreground lg:col-span-4">
            Showing {filteredProducts.length} of {products.length} products.
          </p>
        </CardContent>
      </Card>

      <div className="grid gap-3 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Total</p>
            <p className="mt-2 text-2xl font-bold">{products.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Complete</p>
            <p className="mt-2 text-2xl font-bold text-green-700">{completeCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Needs work</p>
            <p className="mt-2 text-2xl font-bold text-amber-700">{needsWorkCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs uppercase tracking-widest text-muted-foreground">Collections</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {collectionCounts.map((collection) => (
                <Badge key={collection.value} variant="outline">
                  {collection.label}: {collection.count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedIds.length > 0 && (
        <Card className="border-primary/25 bg-primary/5">
          <CardContent className="flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-2 text-sm font-medium text-primary">
              <Layers className="h-4 w-4" />
              {selectedIds.length} product(s) selected
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <select
                value={bulkCollection}
                onChange={(e) => setBulkCollection(e.target.value)}
                className="h-10 rounded-md border border-input bg-white px-3 text-sm shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {productCollections.map((collection) => (
                  <option key={collection.value} value={collection.value}>
                    {collection.label}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={bulkUpdateCollection}
                disabled={bulkWorking}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-60"
              >
                Move collection
              </button>
              <button
                type="button"
                onClick={bulkDeleteProducts}
                disabled={bulkWorking}
                className="rounded-md border border-destructive/30 bg-white px-4 py-2 text-sm font-medium text-destructive disabled:opacity-60"
              >
                Delete selected
              </button>
              <button
                type="button"
                onClick={() => setSelectedIds([])}
                disabled={bulkWorking}
                className="rounded-md border bg-white px-4 py-2 text-sm font-medium disabled:opacity-60"
              >
                Clear
              </button>
            </div>
          </CardContent>
        </Card>
      )}

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
          <div className="overflow-x-auto rounded-md border bg-background">
            <table className="min-w-[920px] w-full text-sm">
              <thead className="bg-muted">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectVisible}
                      aria-label="Select all visible products"
                    />
                  </th>
                  <th className="px-4 py-3 text-left font-medium">Image</th>
                  <th className="px-4 py-3 text-left font-medium">Name</th>
                  <th className="px-4 py-3 text-left font-medium">Collection</th>
                  <th className="px-4 py-3 text-left font-medium">Price</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredProducts.map(({ product, missingFields }) => {
                  return (
                    <tr key={product.id} className={selectedIds.includes(product.id) ? "bg-primary/5" : undefined}>
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(product.id)}
                          onChange={() => toggleProductSelection(product.id)}
                          aria-label={`Select ${product.name}`}
                        />
                      </td>
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
