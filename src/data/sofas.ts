import chesterfield from "@/assets/sofa-chesterfield.jpg";
import curve from "@/assets/sofa-curve.jpg";
import loveseat from "@/assets/sofa-loveseat.jpg";
import sectional from "@/assets/sofa-sectional.jpg";
import midcentury from "@/assets/sofa-midcentury.jpg";
import cloud from "@/assets/sofa-cloud.jpg";

export type Sofa = {
  slug: string;
  name: string;
  type: string;
  size: string;
  price: string;
  image: string;
  shortDescription: string;
  description: string;
  dimensions: { width: string; depth: string; height: string };
  materials: string[];
  leadTime: string;
};

export const sofas: Sofa[] = [
  {
    slug: "harlow-chesterfield",
    name: "Harlow Chesterfield",
    type: "Classic Chesterfield",
    size: "3-Seater · 220 cm",
    price: "€4,890",
    image: chesterfield,
    shortDescription: "Hand-tufted cognac leather on a solid beech frame.",
    description:
      "A modern interpretation of the British icon. Each diamond is hand-tufted by a single craftsman, and the full-grain Italian leather develops a richer patina with every passing year.",
    dimensions: { width: "220 cm", depth: "95 cm", height: "78 cm" },
    materials: ["Full-grain Italian leather", "Solid beech frame", "Hand-tied springs", "Brass studs"],
    leadTime: "10–12 weeks",
  },
  {
    slug: "luna-curve",
    name: "Luna Curve",
    type: "Modular Curved",
    size: "4-Seater · 320 cm",
    price: "€6,250",
    image: curve,
    shortDescription: "A sweeping bouclé silhouette that anchors any room.",
    description:
      "Inspired by 1970s Italian salons, the Luna Curve is built in three modules so it can adapt to any architecture. Wrapped in a dense ivory bouclé woven in Tuscany.",
    dimensions: { width: "320 cm", depth: "110 cm", height: "75 cm" },
    materials: ["Tuscan bouclé", "Kiln-dried hardwood", "High-resilience foam", "Down-wrapped cushions"],
    leadTime: "12–14 weeks",
  },
  {
    slug: "fern-loveseat",
    name: "Fern Loveseat",
    type: "Compact Loveseat",
    size: "2-Seater · 150 cm",
    price: "€2,490",
    image: loveseat,
    shortDescription: "A quiet two-seater in sage Belgian linen.",
    description:
      "Designed for smaller rooms and reading corners. The Fern is upholstered in heavy-weight Belgian linen and balanced on slender oak legs turned by hand.",
    dimensions: { width: "150 cm", depth: "82 cm", height: "80 cm" },
    materials: ["Belgian linen", "Solid oak legs", "Pocket-spring base", "Feather-blend cushions"],
    leadTime: "8–10 weeks",
  },
  {
    slug: "noir-sectional",
    name: "Noir Sectional",
    type: "U-Shape Sectional",
    size: "6-Seater · 360 cm",
    price: "€7,980",
    image: sectional,
    shortDescription: "An evening sofa in deep charcoal velvet.",
    description:
      "Built for long, slow conversations. The Noir spans three modules with hand-stitched piping and a cool-toned cotton velvet that catches the light at every turn.",
    dimensions: { width: "360 cm", depth: "210 cm", height: "76 cm" },
    materials: ["Cotton velvet", "Steel-reinforced legs", "Eight-way hand-tied springs"],
    leadTime: "14–16 weeks",
  },
  {
    slug: "atlas-midcentury",
    name: "Atlas Mid-Century",
    type: "Mid-Century",
    size: "3-Seater · 200 cm",
    price: "€3,690",
    image: midcentury,
    shortDescription: "Burnt orange velvet on tapered walnut legs.",
    description:
      "A tribute to Scandinavian design of the 1960s — clean lines, gentle slope, and a generous seat. Finished with French-polished walnut legs.",
    dimensions: { width: "200 cm", depth: "88 cm", height: "82 cm" },
    materials: ["Cotton velvet", "Solid walnut legs", "Webbed base"],
    leadTime: "10–12 weeks",
  },
  {
    slug: "nimbus-cloud",
    name: "Nimbus Cloud",
    type: "Down-filled Lounge",
    size: "3-Seater · 240 cm",
    price: "€5,420",
    image: cloud,
    shortDescription: "Down-wrapped, oversized, irresistibly soft.",
    description:
      "The Nimbus is built around a deep seat and over-stuffed cushions wrapped in ethically sourced down. An invitation to slow Sunday afternoons.",
    dimensions: { width: "240 cm", depth: "115 cm", height: "78 cm" },
    materials: ["Performance cotton blend", "Ethical down fill", "Hardwood frame"],
    leadTime: "12–14 weeks",
  },
];

export const getSofa = (slug: string) => sofas.find((s) => s.slug === slug);
