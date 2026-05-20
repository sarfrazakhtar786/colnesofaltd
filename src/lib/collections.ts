export const productCollections = [
  {
    value: "Sofa Collection",
    label: "Sofa Collection",
    description: "Hand-crafted sofas, sectionals, loveseats and lounge pieces.",
  },
  {
    value: "Bed Collection",
    label: "Bed Collection",
    description: "Beds and bedroom pieces added through the same product workflow.",
  },
] as const;

export type ProductCollection = (typeof productCollections)[number]["value"];

export function normalizeCollection(category?: string | null): ProductCollection {
  if (category === "Bed" || category === "Bed Collection") return "Bed Collection";
  return "Sofa Collection";
}

export function getCollectionLabel(category?: string | null) {
  return normalizeCollection(category);
}
