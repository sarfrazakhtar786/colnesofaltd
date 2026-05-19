export function getPublicImageUrl(imageUrl?: string) {
  if (!imageUrl) return "";
  try {
    const url = new URL(imageUrl);
    if (url.hostname.includes("lovable.app") && url.pathname.startsWith("/assets/")) {
      return `/${url.pathname.split("/").pop()}`;
    }
  } catch {
    // Plain public paths are handled below.
  }
  if (imageUrl.startsWith("/") || imageUrl.startsWith("http")) return imageUrl;
  return `/${imageUrl}`;
}
