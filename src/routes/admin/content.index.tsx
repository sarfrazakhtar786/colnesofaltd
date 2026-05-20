import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  type ContactDetails,
  defaultContactDetails,
  fetchContactDetails,
} from "@/lib/contact";

const defaultContent = {
  hero_title: "Sofas built the slow way, to be lived in for decades.",
  hero_subtitle:
    "Each piece is hand-cut, hand-stitched and made to your dimensions in our Parisian workshop.",
  hero_image: "",
  about_text: "",
  collection_title: "Six silhouettes, infinite combinations.",
  collection_description:
    "Every model is available in over 80 fabrics and leathers, with custom dimensions on request. Pieces ship in 8-16 weeks.",
  about_hero_title: "A small atelier on Rue de l'Artisan.",
  about_hero_subtitle:
    "Colne Sofa LTD was founded by Elise Marchand in a single workshop in the 11th arrondissement of Paris. Today, fourteen artisans still make every sofa by hand, in the same room where it all started.",
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
};

export const Route = createFileRoute("/admin/content/")({
  component: AdminContent,
});

function AdminContent() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display">Manage Site Content</h1>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="home" className="space-y-6">
        <TabsList className="flex h-auto w-full flex-wrap justify-start gap-2 rounded-sm border bg-card p-2">
          <TabsTrigger value="home">Home Hero</TabsTrigger>
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
