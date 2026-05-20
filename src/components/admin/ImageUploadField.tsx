import { useRef, useState } from "react";
import { Images, ImageUp, Loader2, Trash2 } from "lucide-react";
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

type LibraryImage = {
  name: string;
  path: string;
  publicUrl: string;
};

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
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [libraryImages, setLibraryImages] = useState<LibraryImage[]>([]);

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
    if (libraryOpen) {
      await fetchLibrary();
    }
    setUploading(false);
  }

  async function fetchLibrary() {
    setLibraryLoading(true);
    const { data, error } = await supabase.storage.from(BUCKET_NAME).list(folder, {
      limit: 100,
      sortBy: { column: "created_at", order: "desc" },
    });

    if (error) {
      alert("Media library could not be loaded: " + error.message);
      setLibraryLoading(false);
      return;
    }

    const images =
      data
        ?.filter((file) => file.name && file.id)
        .map((file) => {
          const path = `${folder}/${file.name}`;
          const { data: publicData } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

          return {
            name: file.name,
            path,
            publicUrl: publicData.publicUrl,
          };
        }) || [];

    setLibraryImages(images);
    setLibraryLoading(false);
  }

  async function toggleLibrary() {
    const nextOpen = !libraryOpen;
    setLibraryOpen(nextOpen);
    if (nextOpen) {
      await fetchLibrary();
    }
  }

  async function deleteImage(image: LibraryImage) {
    const confirmed = window.confirm(
      "Delete this image from Supabase Storage? If any page is using this URL, that image will stop loading.",
    );

    if (!confirmed) return;

    const { error } = await supabase.storage.from(BUCKET_NAME).remove([image.path]);
    if (error) {
      alert("Image delete failed: " + error.message);
      return;
    }

    if (value === image.publicUrl) {
      onChange("");
    }
    await fetchLibrary();
  }

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <Label htmlFor={id}>{label}</Label>
          {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
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
          <Button type="button" variant="outline" size="sm" onClick={toggleLibrary}>
            <Images className="mr-2 h-4 w-4" />
            {libraryOpen ? "Hide Library" : "Media Library"}
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
      {libraryOpen && (
        <div className="rounded-md border bg-white p-3 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Media Library</p>
              <p className="text-xs text-muted-foreground">Folder: {folder}</p>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={fetchLibrary}>
              {libraryLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Refresh
            </Button>
          </div>

          {libraryLoading ? (
            <div className="flex items-center justify-center rounded-sm border border-dashed py-8 text-sm text-muted-foreground">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading images...
            </div>
          ) : libraryImages.length > 0 ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {libraryImages.map((image) => (
                <div key={image.path} className="overflow-hidden rounded-sm border bg-background">
                  <div className="aspect-[4/3] bg-muted">
                    <img
                      src={image.publicUrl}
                      alt={image.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div className="space-y-2 p-2">
                    <p className="truncate text-xs text-muted-foreground" title={image.name}>
                      {image.name}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        size="sm"
                        className="h-8 flex-1"
                        onClick={() => onChange(image.publicUrl)}
                      >
                        Use
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => deleteImage(image)}
                        aria-label={`Delete ${image.name}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="rounded-sm border border-dashed py-8 text-center text-sm text-muted-foreground">
              No images uploaded in this folder yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
