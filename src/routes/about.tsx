import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import craftsmanDefault from "@/assets/craftsman.jpg";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Colne Sofa LTD" },
      {
        name: "description",
        content: "Inside the Parisian atelier where every Colne Sofa LTD sofa is made by hand.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      const { data } = await supabase
        .from("site_settings")
        .select("*")
        .eq("key", "site_content")
        .single();

      if (data) setContent(data.value);
      setLoading(false);
    }
    fetchContent();
  }, []);

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" />
      </div>
    );

  const aboutHeroTitle = content?.about_hero_title || "A small atelier on Rue de l'Artisan.";
  const aboutHeroSubtitle =
    content?.about_hero_subtitle ||
    "Colne Sofa LTD was founded by Élise Marchand in a single workshop in the 11th arrondissement of Paris. Today, fourteen artisans still make every sofa by hand, in the same room where it all started.";
  const aboutImage = content?.about_image || craftsmanDefault;
  const values = content?.values || [
    {
      t: "Materials before margins",
      d: "We source full-grain leathers from a tannery in Tuscany and weave our bouclé in a small mill outside Florence. Cheaper alternatives exist; we don't use them.",
    },
    {
      t: "Hands before machines",
      d: "Every spring is hand-tied with hemp twine. Every cushion is filled by hand. A machine could do it in minutes — a craftsman does it for life.",
    },
    {
      t: "Time before haste",
      d: "An average sofa takes 84 hours of work and twelve weeks of patience. We won't ship anything before it's right.",
    },
  ];

  return (
    <>
      <section className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-28 lg:px-10">
        <p className="eyebrow">Since 1978</p>
        <h1 className="mt-6 text-balance font-display text-4xl leading-[1.06] sm:text-6xl lg:text-7xl">
          {aboutHeroTitle}
        </h1>
        <p className="mx-auto mt-8 max-w-2xl text-pretty text-base leading-relaxed text-[#555555] sm:text-lg">
          {aboutHeroSubtitle}
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={aboutImage}
            alt="Inside the Colne Sofa LTD atelier"
            width={1280}
            height={1024}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20 sm:py-28 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-12">
          <h2 className="font-display text-4xl leading-tight lg:col-span-5 sm:text-5xl">
            Our values are simple.
          </h2>
          <div className="space-y-12 lg:col-span-6 lg:col-start-7">
            {values.map((v: any, i: number) => (
              <div key={i} className="border-l-2 border-primary pl-6">
                <h3 className="font-display text-2xl">{v.t}</h3>
                <p className="mt-3 text-pretty leading-relaxed text-[#555555]">{v.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#111111] py-24 text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-10 px-6 text-center lg:grid-cols-4 lg:px-10">
          {[
            { n: "46", l: "Years of practice" },
            { n: "14", l: "Artisans on staff" },
            { n: "84h", l: "Average build time" },
            { n: "Life", l: "Frame warranty" },
          ].map((s) => (
            <div key={s.l}>
              <p className="font-display text-5xl text-primary">{s.n}</p>
              <p className="mt-3 text-xs uppercase tracking-widest text-white/70">{s.l}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
