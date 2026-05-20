import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";

const emptyProduct = {
  name: "",
  slug: "",
  price: "",
  description: "",
  image_url: "",
  category: "Sofa",
  width: "",
  depth: "",
  height: "",
  materials: "",
};

export const Route = createFileRoute("/admin/products/$id")({
  component: EditProduct,
});

function EditProduct() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(emptyProduct);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  async function fetchProduct() {
    setLoading(true);
    const { data, error } = await supabase.from("sofas").select("*").eq("id", id).single();

    if (error) {
      alert("Error loading product: " + error.message);
      navigate({ to: "/admin/products" });
      return;
    }

    setFormData({
      ...emptyProduct,
      ...data,
      materials: Array.isArray(data.materials) ? data.materials.join(", ") : data.materials || "",
    });
    setLoading(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      const next = { ...prev, [name]: value };

      if (name === "name") {
        next.slug = value
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");
      }

      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase.from("sofas").update(formData).eq("id", id);

    if (error) {
      alert("Error updating product: " + error.message);
    } else {
      alert("Product updated successfully!");
      navigate({ to: "/admin/products" });
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl pb-20">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate({ to: "/admin/products" })}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-display">Edit Product</h1>
      </div>

      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Luna Curve"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  required
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="e.g. $2,400"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="slug">Slug (URL identifier)</Label>
              <Input id="slug" name="slug" required value={formData.slug} onChange={handleChange} />
            </div>

            <ImageUploadField
              id="image_url"
              label="Image URL"
              required
              value={formData.image_url}
              onChange={(image_url) => setFormData((prev) => ({ ...prev, image_url }))}
              folder="products"
              placeholder="e.g. /sofa-chesterfield-7mql-6zd.png or https://..."
              hint="Recommended: 1600 x 1200 px or larger."
            />

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
              <div className="grid grid-cols-3 gap-4">
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

            <Button type="submit" className="w-full" disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
