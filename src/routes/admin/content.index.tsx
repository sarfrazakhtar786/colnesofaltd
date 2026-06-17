import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Eye, Loader2, Mail, MapPin, Phone, Save } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getPublicImageUrl } from "@/lib/images";
import {
  type ContactDetails,
  defaultContactDetails,
  fetchContactDetails,
} from "@/lib/contact";

const defaultRepairIssues = [
  "Fabric tear",
  "Cushion sagging",
  "Frame issue",
  "Recliner / mechanism issue",
  "Stitching issue",
  "Foam replacement",
  "Other",
];

const defaultContent = {
  hero_title: "Sofas built the slow way, to be lived in for decades.",
  hero_subtitle:
    "Each piece is made with care, practical comfort, and dimensions tailored for your home.",
  hero_image: "",
  about_text: "",
  collection_title: "Six silhouettes, infinite combinations.",
  collection_description:
    "Every model is available in over 80 fabrics and leathers, with custom dimensions on request. Pieces ship in 8-16 weeks.",
  collection_image: "",
  about_hero_title: "Built in Britain, made for homes that are lived in.",
  about_hero_subtitle:
    "Colne Sofa LTD is a UK-based furniture workshop specialising in made-to-order sofas, beds, and repair work. From our Colne base, we combine careful upholstery, durable materials, and practical service for homes across the UK.",
  about_image: "",
  values: [
    {
      t: "Materials before margins",
      d: "We source full-grain leathers from a tannery in Tuscany and weave our boucle in a small mill outside Florence. Cheaper alternatives exist; we don't use them.",
    },
    {
      t: "Hands before machines",
      d: "Every spring is hand-tied with hemp twine. Every cushion is filled by hand. A machine could do it in minutes; a craftsman does it for life.",
    },
    {
      t: "Time before haste",
      d: "An average sofa takes 84 hours of work and twelve weeks of patience. We won't ship anything before it's right.",
    },
  ],
  repair_issues: defaultRepairIssues,
  craftsmanship_eyebrow: "Craftsmanship",
  craftsmanship_title: "Fourteen pairs of hands.",
  craftsmanship_title_accent: "One sofa at a time.",
  craftsmanship_description:
    "From the first cut of beech to the final hand-stitched seam, every Colne Sofa LTD sofa passes through fourteen artisans over an average of 84 hours of work.",
  craftsmanship_image: "",
  craftsmanship_stats: [
    { label: "Founded", value: "1978" },
    { label: "Pieces / year", value: "400" },
    { label: "Frame warranty", value: "Life" },
  ],
};

export const Route = createFileRoute("/admin/content/")({
  component: AdminContent,
});

function AdminContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [content, setContent] = useState(defaultContent);
  const [contact, setContact] = useState<ContactDetails>(defaultContactDetails);

  useEffect(() => {
    fetchContent();
  }, []);

  async function fetchContent() {
    const [{ data }, contactData] = await Promise.all([
      supabase.from("site_settings").select("*").eq("key", "site_content").single(),
      fetchContactDetails(),
    ]);

    if (data?.value) {
      setContent({
        ...defaultContent,
        ...data.value,
        values: Array.isArray(data.value.values) ? data.value.values : defaultContent.values,
        repair_issues: Array.isArray(data.value.repair_issues)
          ? data.value.repair_issues
              .map((issue: unknown) => String(issue || "").trim())
              .filter(Boolean)
          : defaultContent.repair_issues,
        craftsmanship_stats: Array.isArray(data.value.craftsmanship_stats)
          ? data.value.craftsmanship_stats.map((stat: { label?: string; value?: string }) => ({
              label: String(stat?.label || "").trim(),
              value: String(stat?.value || "").trim(),
            }))
          : defaultContent.craftsmanship_stats,
      });
    }
    setContact(contactData);

    setLoading(false);
  }

  async function handleSave() {
    setSaving(true);
    const { error } = await supabase.from("site_settings").upsert([
      { key: "site_content", value: content },
      { key: "contact_details", value: contact },
    ]);

    if (error) {
      alert("Error saving content: " + error.message);
    } else {
      alert("Content updated successfully!");
    }
    setSaving(false);
  }

  function updateContact<K extends keyof ContactDetails>(key: K, value: ContactDetails[K]) {
    setContact((current) => ({ ...current, [key]: value }));
  }

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl pb-20">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-display">Manage Site Content</h1>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button type="button" variant="outline" onClick={() => setPreviewOpen(true)}>
            <Eye className="h-4 w-4 mr-2" />
            Preview Changes
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
        </div>
      </div>

      <ContentPreviewDialog
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        content={content}
        contact={contact}
      />

      <Tabs defaultValue="home" className="space-y-6">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 rounded-sm border bg-card p-2">
          <TabsTrigger value="home">Home Hero</TabsTrigger>
          <TabsTrigger value="craftsmanship">Craftsmanship</TabsTrigger>
          <TabsTrigger value="collection">Collection</TabsTrigger>
          <TabsTrigger value="about">About Page</TabsTrigger>
          <TabsTrigger value="values">Values</TabsTrigger>
          <TabsTrigger value="brand">Contact/Footer</TabsTrigger>
        </TabsList>

        <TabsContent value="home" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Home Page - Hero Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-2">
                <Label>Main Title</Label>
                <Textarea
                  value={content.hero_title}
                  onChange={(e) => setContent({ ...content, hero_title: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label>Subtitle / Description</Label>
                <Textarea
                  value={content.hero_subtitle}
                  onChange={(e) => setContent({ ...content, hero_subtitle: e.target.value })}
                  rows={3}
                />
              </div>
              <ImageUploadField
                id="hero_image"
                label="Hero Background Image URL"
                value={content.hero_image}
                onChange={(hero_image) => setContent({ ...content, hero_image })}
                folder="hero"
                hint="Recommended: 2400 x 1350 px or larger, landscape 16:9."
                aspect="hero"
              />
              <div className="grid gap-2 border-t pt-5">
                <Label>Home About Summary</Label>
                <p className="text-xs text-muted-foreground">
                  This text appears in the homepage philosophy/about section.
                </p>
                <Textarea
                  value={content.about_text}
                  onChange={(e) => setContent({ ...content, about_text: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="grid gap-2 border-t pt-5">
                <Label>Repair Issue List (Repair Request Form)</Label>
                <p className="text-xs text-muted-foreground">
                  Add one repair issue per line. This updates the issue dropdown in the public repair
                  request form.
                </p>
                <Textarea
                  value={Array.isArray(content.repair_issues) ? content.repair_issues.join("\n") : ""}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      repair_issues: e.target.value
                        .split("\n")
                        .map((issue) => issue.trim())
                        .filter(Boolean),
                    })
                  }
                  rows={7}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="craftsmanship" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Home Page - Craftsmanship Section</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-2">
                <Label>Eyebrow Label</Label>
                <Input
                  value={content.craftsmanship_eyebrow}
                  onChange={(e) =>
                    setContent({ ...content, craftsmanship_eyebrow: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Main Title</Label>
                <Input
                  value={content.craftsmanship_title}
                  onChange={(e) => setContent({ ...content, craftsmanship_title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Accent Title (italic line)</Label>
                <Input
                  value={content.craftsmanship_title_accent}
                  onChange={(e) =>
                    setContent({ ...content, craftsmanship_title_accent: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea
                  value={content.craftsmanship_description}
                  onChange={(e) =>
                    setContent({ ...content, craftsmanship_description: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <ImageUploadField
                id="craftsmanship_image"
                label="Section Image URL"
                value={content.craftsmanship_image}
                onChange={(craftsmanship_image) =>
                  setContent({ ...content, craftsmanship_image })
                }
                folder="craftsmanship"
                hint="Recommended: portrait 4:5 ratio, e.g. 1280 x 1600 px."
              />
              <div className="space-y-4 border-t pt-5">
                <Label>Stats (3 columns on homepage)</Label>
                {content.craftsmanship_stats.map((stat, index) => (
                  <div key={index} className="grid gap-3 rounded-md border p-4 sm:grid-cols-2">
                    <div className="grid gap-2">
                      <Label>Stat {index + 1} Label</Label>
                      <Input
                        value={stat.label}
                        onChange={(e) => {
                          const craftsmanship_stats = [...content.craftsmanship_stats];
                          craftsmanship_stats[index] = {
                            ...craftsmanship_stats[index],
                            label: e.target.value,
                          };
                          setContent({ ...content, craftsmanship_stats });
                        }}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label>Stat {index + 1} Value</Label>
                      <Input
                        value={stat.value}
                        onChange={(e) => {
                          const craftsmanship_stats = [...content.craftsmanship_stats];
                          craftsmanship_stats[index] = {
                            ...craftsmanship_stats[index],
                            value: e.target.value,
                          };
                          setContent({ ...content, craftsmanship_stats });
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="collection" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Collection Page - Header</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label>Collection Title</Label>
                <Input
                  value={content.collection_title}
                  onChange={(e) => setContent({ ...content, collection_title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>Collection Description</Label>
                <Textarea
                  value={content.collection_description}
                  onChange={(e) =>
                    setContent({ ...content, collection_description: e.target.value })
                  }
                  rows={3}
                />
              </div>
              <ImageUploadField
                id="collection_image"
                label="Collection Hero Image URL"
                value={content.collection_image}
                onChange={(collection_image) => setContent({ ...content, collection_image })}
                folder="collection"
                hint="Recommended: 2400 x 1350 px or larger, landscape 16:9."
                aspect="hero"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>About Us Page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-2">
                <Label>About Hero Title</Label>
                <Textarea
                  value={content.about_hero_title}
                  onChange={(e) => setContent({ ...content, about_hero_title: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label>About Hero Subtitle</Label>
                <Textarea
                  value={content.about_hero_subtitle}
                  onChange={(e) =>
                    setContent({ ...content, about_hero_subtitle: e.target.value })
                  }
                  rows={4}
                />
              </div>
              <ImageUploadField
                id="about_image"
                label="Main Image URL"
                value={content.about_image}
                onChange={(about_image) => setContent({ ...content, about_image })}
                folder="about"
                hint="Recommended: 1600 x 1200 px or larger."
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="values" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Company Values</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {content.values.map((value, index) => (
                <div key={index} className="space-y-3 rounded-md border p-4">
                  <Label>Value {index + 1} Title</Label>
                  <Input
                    value={value.t}
                    onChange={(e) => {
                      const values = [...content.values];
                      values[index] = { ...values[index], t: e.target.value };
                      setContent({ ...content, values });
                    }}
                  />
                  <Label>Value {index + 1} Description</Label>
                  <Textarea
                    value={value.d}
                    onChange={(e) => {
                      const values = [...content.values];
                      values[index] = { ...values[index], d: e.target.value };
                      setContent({ ...content, values });
                    }}
                    rows={3}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="brand" className="mt-0">
          <Card>
            <CardHeader>
              <CardTitle>Contact / Footer Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={contact.email}
                    onChange={(e) => updateContact("email", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Display Phone</Label>
                  <Input
                    value={contact.phoneDisplay}
                    onChange={(e) => updateContact("phoneDisplay", e.target.value)}
                    placeholder="07417 556531"
                  />
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>WhatsApp Number</Label>
                  <Input
                    value={contact.whatsappNumber}
                    onChange={(e) => updateContact("whatsappNumber", e.target.value)}
                    placeholder="447417556531"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use country code format without plus sign, e.g. 447417556531.
                  </p>
                </div>
                <div className="grid gap-2">
                  <Label>Opening Hours</Label>
                  <Input
                    value={contact.hours}
                    onChange={(e) => updateContact("hours", e.target.value)}
                    placeholder="Mon-Sat 10:00 - 18:00"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Footer Paragraph</Label>
                <Textarea
                  value={contact.footerText}
                  onChange={(e) => updateContact("footerText", e.target.value)}
                  rows={3}
                  placeholder="Short brand message shown under the footer logo."
                />
                <p className="text-xs text-muted-foreground">
                  This paragraph appears under the footer logo on every public page.
                </p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="grid gap-2">
                  <Label>Facebook URL</Label>
                  <Input
                    type="url"
                    value={contact.socialLinks.facebook}
                    onChange={(e) =>
                      updateContact("socialLinks", {
                        ...contact.socialLinks,
                        facebook: e.target.value,
                      })
                    }
                    placeholder="https://facebook.com/..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Instagram URL</Label>
                  <Input
                    type="url"
                    value={contact.socialLinks.instagram}
                    onChange={(e) =>
                      updateContact("socialLinks", {
                        ...contact.socialLinks,
                        instagram: e.target.value,
                      })
                    }
                    placeholder="https://instagram.com/..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label>LinkedIn URL</Label>
                  <Input
                    type="url"
                    value={contact.socialLinks.linkedin}
                    onChange={(e) =>
                      updateContact("socialLinks", {
                        ...contact.socialLinks,
                        linkedin: e.target.value,
                      })
                    }
                    placeholder="https://linkedin.com/company/..."
                  />
                </div>
                <div className="grid gap-2">
                  <Label>YouTube URL</Label>
                  <Input
                    type="url"
                    value={contact.socialLinks.youtube}
                    onChange={(e) =>
                      updateContact("socialLinks", {
                        ...contact.socialLinks,
                        youtube: e.target.value,
                      })
                    }
                    placeholder="https://youtube.com/..."
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Address Lines</Label>
                <Textarea
                  value={contact.addressLines.join("\n")}
                  onChange={(e) =>
                    updateContact(
                      "addressLines",
                      e.target.value
                        .split("\n")
                        .map((line) => line.trim())
                        .filter(Boolean),
                    )
                  }
                  rows={5}
                />
                <p className="text-xs text-muted-foreground">
                  Put each address line on its own line. This updates Contact page and Footer.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ContentPreviewDialog({
  open,
  onOpenChange,
  content,
  contact,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  content: typeof defaultContent;
  contact: ContactDetails;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] max-w-6xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Preview Changes
          </DialogTitle>
          <DialogDescription>
            Review the main website sections before saving them to Supabase.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <section className="overflow-hidden rounded-sm border bg-background">
            <div className="relative isolate min-h-[360px] p-6 sm:p-10">
              {content.hero_image && (
                <img
                  src={getPublicImageUrl(content.hero_image)}
                  alt="Hero preview"
                  className="absolute inset-y-0 right-0 -z-10 h-full w-full object-cover opacity-75 lg:w-[58%]"
                />
              )}
              <div className="absolute inset-0 -z-10 bg-gradient-to-r from-background via-background/95 to-background/30" />
              <p className="eyebrow">Home Hero</p>
              <h2 className="mt-4 max-w-2xl font-display text-4xl leading-tight text-foreground sm:text-5xl">
                {content.hero_title || "Untitled hero"}
              </h2>
              <p className="mt-5 max-w-xl leading-relaxed text-[#555555]">
                {content.hero_subtitle || "No hero subtitle entered yet."}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <span className="inline-flex justify-center rounded-sm bg-primary px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-primary-foreground">
                  See the Collection
                </span>
                <span className="inline-flex justify-center rounded-sm bg-secondary px-5 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-secondary-foreground">
                  Request a Quote
                </span>
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-sm border bg-card p-6">
              <div className="overflow-hidden rounded-sm border bg-muted">
                {content.collection_image ? (
                  <img
                    src={getPublicImageUrl(content.collection_image)}
                    alt="Collection preview"
                    className="aspect-[16/9] h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[16/9] items-center justify-center text-sm text-muted-foreground">
                    No collection hero image selected
                  </div>
                )}
              </div>
              <p className="eyebrow mt-5">Collection Header</p>
              <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
                {content.collection_title || "Untitled collection"}
              </h2>
              <p className="mt-4 leading-relaxed text-[#555555]">
                {content.collection_description || "No collection description entered yet."}
              </p>
            </section>

            <section className="rounded-sm border bg-card p-6">
              <p className="eyebrow">Contact / Footer</p>
              <div className="mt-4 space-y-3 text-sm text-[#555555]">
                <p className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>
                    {contact.addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </span>
                </p>
                <p className="flex items-center gap-3">
                  <Mail className="h-4 w-4 shrink-0 text-primary" />
                  {contact.email}
                </p>
                <p className="flex items-center gap-3">
                  <Phone className="h-4 w-4 shrink-0 text-primary" />
                  {contact.phoneDisplay}
                </p>
                <p className="text-muted-foreground">{contact.hours}</p>
                <div className="border-t pt-3">
                  <p className="font-medium text-secondary">Footer paragraph</p>
                  <p className="mt-1 leading-relaxed">{contact.footerText}</p>
                </div>
                {Object.values(contact.socialLinks).some(Boolean) && (
                  <div className="border-t pt-3">
                    <p className="font-medium text-secondary">Social links</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {Object.entries(contact.socialLinks).map(([platform, url]) =>
                        url ? (
                          <span
                            key={platform}
                            className="rounded-sm border border-primary/25 px-2 py-1 text-xs uppercase tracking-widest text-primary"
                          >
                            {platform}
                          </span>
                        ) : null,
                      )}
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>

          <section className="rounded-sm border bg-card p-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
              <div>
                <p className="eyebrow">About Page</p>
                <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
                  {content.about_hero_title || "Untitled about page"}
                </h2>
                <p className="mt-4 leading-relaxed text-[#555555]">
                  {content.about_hero_subtitle || "No about subtitle entered yet."}
                </p>
              </div>
              <div className="overflow-hidden rounded-sm border bg-muted">
                {content.about_image ? (
                  <img
                    src={getPublicImageUrl(content.about_image)}
                    alt="About preview"
                    className="aspect-[16/10] h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center text-sm text-muted-foreground">
                    No about image selected
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-sm border bg-card p-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="overflow-hidden rounded-sm border bg-muted">
                {content.craftsmanship_image ? (
                  <img
                    src={getPublicImageUrl(content.craftsmanship_image)}
                    alt="Craftsmanship preview"
                    className="aspect-[4/5] h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[4/5] items-center justify-center text-sm text-muted-foreground">
                    No craftsmanship image selected
                  </div>
                )}
              </div>
              <div>
                <p className="eyebrow">{content.craftsmanship_eyebrow || "Craftsmanship"}</p>
                <h2 className="mt-4 font-display text-3xl leading-tight sm:text-4xl">
                  {content.craftsmanship_title || "Untitled craftsmanship section"}
                  {content.craftsmanship_title_accent && (
                    <>
                      <br />
                      <span className="italic text-primary">{content.craftsmanship_title_accent}</span>
                    </>
                  )}
                </h2>
                <p className="mt-4 leading-relaxed text-[#555555]">
                  {content.craftsmanship_description || "No craftsmanship description entered yet."}
                </p>
                <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                  {content.craftsmanship_stats.map((stat, index) => (
                    <div key={index}>
                      <dt className="text-xs uppercase tracking-widest text-muted-foreground">
                        {stat.label || `Stat ${index + 1}`}
                      </dt>
                      <dd className="mt-2 font-display text-2xl">{stat.value || "—"}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </section>

          <section className="rounded-sm border bg-card p-6">
            <p className="eyebrow">Company Values</p>
            <div className="mt-5 grid gap-4 md:grid-cols-3">
              {content.values.map((value, index) => (
                <div key={index} className="border-l-2 border-primary pl-4">
                  <h3 className="font-display text-xl">{value.t || `Value ${index + 1}`}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#555555]">
                    {value.d || "No description entered yet."}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
