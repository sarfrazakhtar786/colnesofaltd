import { type PointerEvent, useEffect, useMemo, useRef, useState } from "react";
import { Crop, Loader2, Move } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

type CropAspect = "hero" | "product";

type ImageCropDialogProps = {
  file: File | null;
  aspect: CropAspect;
  label: string;
  onCancel: () => void;
  onCrop: (blob: Blob, fileName: string) => Promise<void>;
};

type ImageSize = {
  width: number;
  height: number;
};

type Position = {
  x: number;
  y: number;
};

const cropSettings = {
  hero: {
    ratio: 16 / 9,
    outputWidth: 2400,
    outputHeight: 1350,
    label: "Hero crop: 2400 x 1350 px, landscape 16:9",
  },
  product: {
    ratio: 4 / 3,
    outputWidth: 1600,
    outputHeight: 1200,
    label: "Image crop: 1600 x 1200 px, landscape 4:3",
  },
};

function getOutputType(file: File) {
  if (["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
    return file.type;
  }

  return "image/jpeg";
}

function getOutputFileName(file: File, outputType: string) {
  const extension = outputType === "image/png" ? "png" : outputType === "image/webp" ? "webp" : "jpg";
  const baseName = file.name.replace(/\.[^/.]+$/, "") || "image";
  return `${baseName}-cropped.${extension}`;
}

function clampPosition(position: Position, zoom: number, imageSize: ImageSize, frameSize: ImageSize, ratio: number) {
  if (!imageSize.width || !imageSize.height || !frameSize.width || !frameSize.height) {
    return position;
  }

  const imageRatio = imageSize.width / imageSize.height;
  const baseWidth = imageRatio > ratio ? frameSize.height * imageRatio : frameSize.width;
  const baseHeight = imageRatio > ratio ? frameSize.height : frameSize.width / imageRatio;
  const displayWidth = baseWidth * zoom;
  const displayHeight = baseHeight * zoom;
  const maxX = Math.max(0, (displayWidth - frameSize.width) / 2);
  const maxY = Math.max(0, (displayHeight - frameSize.height) / 2);

  return {
    x: Math.min(maxX, Math.max(-maxX, position.x)),
    y: Math.min(maxY, Math.max(-maxY, position.y)),
  };
}

export function ImageCropDialog({ file, aspect, label, onCancel, onCrop }: ImageCropDialogProps) {
  const frameRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const dragRef = useRef<{ startX: number; startY: number; position: Position } | null>(null);
  const objectUrl = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);
  const settings = cropSettings[aspect];
  const [imageSize, setImageSize] = useState<ImageSize>({ width: 0, height: 0 });
  const [frameSize, setFrameSize] = useState<ImageSize>({ width: 0, height: 0 });
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [objectUrl]);

  useEffect(() => {
    setPosition({ x: 0, y: 0 });
    setZoom(1);
  }, [file]);

  useEffect(() => {
    function updateFrameSize() {
      const frame = frameRef.current;
      if (!frame) return;

      setFrameSize({
        width: frame.clientWidth,
        height: frame.clientHeight,
      });
    }

    updateFrameSize();
    window.addEventListener("resize", updateFrameSize);

    return () => window.removeEventListener("resize", updateFrameSize);
  }, [objectUrl]);

  const display = useMemo(() => {
    if (!imageSize.width || !imageSize.height || !frameSize.width || !frameSize.height) {
      return {
        width: 0,
        height: 0,
        left: 0,
        top: 0,
      };
    }

    const imageRatio = imageSize.width / imageSize.height;
    const baseWidth = imageRatio > settings.ratio ? frameSize.height * imageRatio : frameSize.width;
    const baseHeight = imageRatio > settings.ratio ? frameSize.height : frameSize.width / imageRatio;
    const width = baseWidth * zoom;
    const height = baseHeight * zoom;

    return {
      width,
      height,
      left: (frameSize.width - width) / 2 + position.x,
      top: (frameSize.height - height) / 2 + position.y,
    };
  }, [frameSize, imageSize, position, settings.ratio, zoom]);

  function handleZoomChange(value: number[]) {
    const nextZoom = value[0] || 1;
    setZoom(nextZoom);
    setPosition((current) => clampPosition(current, nextZoom, imageSize, frameSize, settings.ratio));
  }

  function handlePointerDown(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      position,
    };
  }

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (!dragRef.current) return;

    const nextPosition = {
      x: dragRef.current.position.x + event.clientX - dragRef.current.startX,
      y: dragRef.current.position.y + event.clientY - dragRef.current.startY,
    };

    setPosition(clampPosition(nextPosition, zoom, imageSize, frameSize, settings.ratio));
  }

  function handlePointerUp(event: PointerEvent<HTMLDivElement>) {
    event.currentTarget.releasePointerCapture(event.pointerId);
    dragRef.current = null;
  }

  async function saveCrop() {
    if (!file || !imageRef.current || !frameSize.width || !frameSize.height || !display.width || !display.height) {
      return;
    }

    setSaving(true);
    const canvas = document.createElement("canvas");
    canvas.width = settings.outputWidth;
    canvas.height = settings.outputHeight;
    const context = canvas.getContext("2d");

    if (!context) {
      setSaving(false);
      alert("Image crop failed. Please try another image.");
      return;
    }

    const sourceX = Math.max(0, (-display.left / display.width) * imageSize.width);
    const sourceY = Math.max(0, (-display.top / display.height) * imageSize.height);
    const sourceWidth = Math.min(imageSize.width - sourceX, (frameSize.width / display.width) * imageSize.width);
    const sourceHeight = Math.min(imageSize.height - sourceY, (frameSize.height / display.height) * imageSize.height);
    const outputType = getOutputType(file);

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";
    context.drawImage(
      imageRef.current,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      settings.outputWidth,
      settings.outputHeight,
    );

    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          setSaving(false);
          alert("Image crop failed. Please try another image.");
          return;
        }

        await onCrop(blob, getOutputFileName(file, outputType));
        setSaving(false);
      },
      outputType,
      outputType === "image/jpeg" ? 0.92 : undefined,
    );
  }

  return (
    <Dialog open={Boolean(file)} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent className="max-h-[92vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crop className="h-5 w-5 text-primary" />
            Crop {label}
          </DialogTitle>
          <DialogDescription>{settings.label}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md border bg-muted/30 p-3">
            <div
              ref={frameRef}
              className="relative mx-auto w-full max-w-3xl touch-none overflow-hidden rounded-sm border bg-black"
              style={{ aspectRatio: settings.ratio }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              {objectUrl && (
                <img
                  ref={imageRef}
                  src={objectUrl}
                  alt={label}
                  draggable={false}
                  onLoad={(event) => {
                    setImageSize({
                      width: event.currentTarget.naturalWidth,
                      height: event.currentTarget.naturalHeight,
                    });
                    setFrameSize({
                      width: event.currentTarget.parentElement?.clientWidth || 0,
                      height: event.currentTarget.parentElement?.clientHeight || 0,
                    });
                  }}
                  className="absolute max-w-none select-none"
                  style={{
                    width: display.width || "100%",
                    height: display.height || "auto",
                    left: display.left,
                    top: display.top,
                  }}
                />
              )}
              <div className="pointer-events-none absolute inset-0 border-2 border-white/85 shadow-[inset_0_0_0_999px_rgba(0,0,0,0.08)]" />
              <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-sm bg-black/55 px-2 py-1 text-xs text-white">
                <Move className="h-3.5 w-3.5" />
                Drag to reposition
              </div>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <Label>Zoom</Label>
              <span className="text-xs text-muted-foreground">{Math.round(zoom * 100)}%</span>
            </div>
            <Slider value={[zoom]} min={1} max={3} step={0.01} onValueChange={handleZoomChange} />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel} disabled={saving}>
            Cancel
          </Button>
          <Button type="button" onClick={saveCrop} disabled={saving || !imageSize.width}>
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Cropped Image
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
