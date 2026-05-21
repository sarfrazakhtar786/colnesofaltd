import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { productCollections } from "@/lib/collections";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export const Route = createFileRoute("/admin/products/new")({
  component: AddProduct,
});

function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    price: "",
    description: "",
    image_url: "",
    category: "Sofa Collection",
    width: "",
    depth: "",
    height: "",
    materials: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormError("");
    setFieldErrors((current) => ({ ...current, [name]: "" }));
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Auto-generate slug from name
    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        slug: value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, ""),
      }));
    }
  };

  function validateProduct() {
    const nextErrors: Record<string, string> = {};

    if (!formData.name.trim()) nextErrors.name = "Product name is required.";
    if (!formData.slug.trim()) nextErrors.slug = "Slug is required for the product URL.";
    if (!formData.price.trim()) nextErrors.price = "Price is required.";
    if (!formData.image_url.trim()) nextErrors.image_url = "Please upload or select a product image.";

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!validateProduct()) {
      setFormError("Please fix the highlighted fields before saving this product.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("sofas").insert([formData]);

    if (error) {
      setFormError(error.message);
    } else {
      navigate({ to: "/admin/products" });
    }
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-2xl pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-display sm:text-3xl">Add New Product</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            {formError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Product could not be saved</AlertTitle>
                <AlertDescription>{formError}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  aria-invalid={Boolean(fieldErrors.name)}
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Luna Curve"
                />
                {fieldErrors.name && (
                  <p className="text-xs font-medium text-destructive">{fieldErrors.name}</p>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  aria-invalid={Boolean(fieldErrors.price)}
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. $2,400"
                />
                {fieldErrors.price && (
                  <p className="text-xs font-medium text-destructive">{fieldErrors.price}</p>
                )}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug (URL identifier)</Label>
              <Input
                id="slug"
                name="slug"
                aria-invalid={Boolean(fieldErrors.slug)}
                value={formData.slug}
                onChange={handleChange}
              />
              {fieldErrors.slug && (
                <p className="text-xs font-medium text-destructive">{fieldErrors.slug}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Collection</Label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="h-10 rounded-md border border-input bg-white px-3 text-sm shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {productCollections.map((collection) => (
                  <option key={collection.value} value={collection.value}>
                    {collection.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">
                This decides whether the product appears under Sofa Collection or Bed Collection.
              </p>
            </div>

            <ImageUploadField
              id="image_url"
              label="Image URL"
              value={formData.image_url}
              onChange={(image_url) => {
                setFormError("");
                setFieldErrors((current) => ({ ...current, image_url: "" }));
                setFormData((prev) => ({ ...prev, image_url }));
              }}
              folder="products"
              placeholder="e.g. /sofa-chesterfield-7mql-6zd.png or https://..."
              hint="Recommended: 1600 x 1200 px or larger."
            />
            {fieldErrors.image_url && (
              <p className="-mt-4 text-xs font-medium text-destructive">
                {fieldErrors.image_url}
              </p>
            )}

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-4">Dimensions</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="grid gap-2">
                  <Label htmlFor="width">Width</Label>
                  <Input
                    id="width"
                    name="width"
                    value={formData.width}
                    onChange={handleChange}
                    placeholder="e.g. 220 cm"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="depth">Depth</Label>
                  <Input
                    id="depth"
                    name="depth"
                    value={formData.depth}
                    onChange={handleChange}
                    placeholder="e.g. 95 cm"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="height">Height</Label>
                  <Input
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="e.g. 78 cm"
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="materials">Materials (Comma separated)</Label>
              <Input
                id="materials"
                name="materials"
                value={formData.materials}
                onChange={handleChange}
                placeholder="e.g. Solid beech frame, Italian leather"
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Product
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
