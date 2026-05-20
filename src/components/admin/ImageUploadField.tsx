import { useRef, useState } from "react";
import { ImageUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";
import { ImageUrlPreview } from "@/components/admin/ImageUrlPreview";

type ImageUploadFieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder: "hero" | "about" | "products" | "logos";
  required?: boolean;
  placeholder?: string;
  hint?: string;
  aspect?: "hero" | "product";
};

const BUCKET_NAME = "site-images";

function slugifyFileName(name: string) {
  const extension = name.split(".").pop()?.toLowerCase() || "jpg";
  const baseName = name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${baseName || "image"}-${Date.now()}.${extension}`;
}

export function ImageUploadField({
  id,
  label,
  value,
  onChange,
  folder,
  required,
  placeholder = "https://...",
  hint,
  aspect = "product",
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload(file?: File) {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }

    setUploading(true);
    const filePath = `${folder}/${slugifyFileName(file.name)}`;
    const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
      cacheControl: "31536000",
      upsert: false,
    });

    if (error) {
      alert("Image upload failed: " + error.message);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    onChange(data.publicUrl);
    setUploading(false);
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <Label htmlFor={id}>{label}</Label>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => handleUpload(e.target.files?.[0])}
          />
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <ImageUp className="mr-2 h-4 w-4" />
            )}
            {uploading ? "Uploading..." : "Upload Image"}
          </Button>
        </div>
      </div>
      <Input
        id={id}
        name={id}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      <ImageUrlPreview url={value} label={`${label} preview`} hint={hint} aspect={aspect} />
    </div>
  );
}
