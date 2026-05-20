import { useEffect, useState } from "react";
import { ImageIcon } from "lucide-react";
import { getPublicImageUrl } from "@/lib/images";

type ImageUrlPreviewProps = {
  url?: string;
  label?: string;
  hint?: string;
  aspect?: "hero" | "product";
};

export function ImageUrlPreview({
  url,
  label = "Image preview",
  hint,
  aspect = "product",
}: ImageUrlPreviewProps) {
  const [failed, setFailed] = useState(false);
  const src = getPublicImageUrl(url);

  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <div className="space-y-2 rounded-md border border-dashed border-border bg-muted/30 p-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </div>

      {src && !failed ? (
        <div
          className={
            aspect === "hero"
              ? "aspect-[16/7] overflow-hidden rounded-sm border bg-white"
              : "aspect-[4/3] overflow-hidden rounded-sm border bg-white"
          }
        >
          <img
            src={src}
            alt={label}
            className="h-full w-full object-cover"
            onError={() => setFailed(true)}
          />
        </div>
      ) : (
        <div
          className={
            aspect === "hero"
              ? "flex aspect-[16/7] items-center justify-center rounded-sm border bg-white text-muted-foreground"
              : "flex aspect-[4/3] items-center justify-center rounded-sm border bg-white text-muted-foreground"
          }
        >
          <div className="flex items-center gap-2 text-sm">
            <ImageIcon className="h-4 w-4" />
            <span>{src ? "Image could not be loaded" : "Paste an image URL to preview it here"}</span>
          </div>
        </div>
      )}
    </div>
  );
}
