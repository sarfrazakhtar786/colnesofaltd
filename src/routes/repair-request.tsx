import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ImageUp, Loader2 } from "lucide-react";
import { contactDetails, fetchContactDetails } from "@/lib/contact";
import { saveRepairRequest } from "@/lib/submissions";
import { supabase } from "@/lib/supabase";

const BUCKET_NAME = "site-images";

const defaultRepairIssues = [
  "Fabric tear",
  "Cushion sagging",
  "Frame issue",
  "Recliner / mechanism issue",
  "Stitching issue",
  "Foam replacement",
  "Other",
];

export const Route = createFileRoute("/repair-request")({
  head: () => ({
    meta: [
      { title: "Repair Request - Colne Sofa LTD" },
      {
        name: "description",
        content:
          "Send Colne Sofa LTD a sofa repair request with your contact details, issue type, and repair notes.",
      },
      { property: "og:title", content: "Repair Request - Colne Sofa LTD" },
      { property: "og:description", content: "Request sofa repair support from Colne Sofa LTD." },
    ],
  }),
  component: RepairRequestPage,
});

function RepairRequestPage() {
  const [details, setDetails] = useState(contactDetails);
  const [repairIssues, setRepairIssues] = useState(defaultRepairIssues);
  const [sent, setSent] = useState(false);
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");

  useEffect(() => {
    async function loadPageSettings() {
      const [contactData, contentRes] = await Promise.all([
        fetchContactDetails(),
        supabase.from("site_settings").select("value").eq("key", "site_content").single(),
      ]);
      setDetails(contactData);

      const dynamicIssues = contentRes.data?.value?.repair_issues;
      if (Array.isArray(dynamicIssues)) {
        const cleanedIssues = dynamicIssues
          .map((issue: unknown) => String(issue || "").trim())
          .filter(Boolean);
        if (cleanedIssues.length > 0) {
          setRepairIssues(cleanedIssues);
        }
      }
    }

    loadPageSettings();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) {
      e.currentTarget.reportValidity();
      return;
    }
    if (photoUploading) {
      setPhotoError("Please wait until the photo upload is complete.");
      return;
    }

    const form = new FormData(e.currentTarget);
    const submission = {
      first_name: String(form.get("firstName") || ""),
      last_name: String(form.get("lastName") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      address: String(form.get("address") || ""),
      product_type: String(form.get("productType") || ""),
      issue_type: String(form.get("issueType") || ""),
      preferred_timeline: String(form.get("timeline") || ""),
      photo_url: photoUrl,
      details: String(form.get("details") || ""),
    };

    const message = [
      "New repair request - Colne Sofa LTD",
      "",
      `Name: ${submission.first_name} ${submission.last_name}`.trim(),
      `Email: ${submission.email}`,
      `Phone: ${submission.phone}`,
      `Address / postcode: ${submission.address}`,
      `Sofa / product type: ${submission.product_type}`,
      `Repair issue: ${submission.issue_type}`,
      `Preferred timeline: ${submission.preferred_timeline || "Not specified"}`,
      `Repair photo: ${submission.photo_url || "Not uploaded"}`,
      "",
      "Repair details:",
      submission.details,
    ].join("\n");

    const { error } = await saveRepairRequest(submission);
    if (error) {
      console.warn("Repair request was not saved:", error.message);
    }

    const whatsappUrl = `https://wa.me/${details.whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    setSent(true);
  }

  async function uploadRepairPhoto(file?: File) {
    setPhotoError("");
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.");
      return;
    }

    const maxBytes = 8 * 1024 * 1024;
    if (file.size > maxBytes) {
      setPhotoError("Image is too large. Please upload an image under 8 MB.");
      return;
    }

    setPhotoUploading(true);
    const filePath = `repairs/${slugifyFileName(file.name)}`;
    const { error } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, {
      cacheControl: "31536000",
      upsert: false,
      contentType: file.type,
    });

    if (error) {
      setPhotoError("Photo upload failed: " + error.message);
      setPhotoUploading(false);
      return;
    }

    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
    setPhotoUrl(data.publicUrl);
    setPhotoUploading(false);
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-20 sm:py-24 lg:px-10">
      <p className="eyebrow">Repair Service</p>
      <h1 className="mt-5 text-balance font-display text-4xl leading-[1.06] sm:text-6xl">
        Request a sofa repair.
        <br />
        <span className="italic text-primary">Send details straight to our team.</span>
      </h1>
      <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-[#555555]">
        Tell us what needs repairing, where the sofa is located, and the best way to contact you.
        We&apos;ll review the details and reply on WhatsApp.
      </p>

      {sent ? (
        <div className="mt-16 rounded-sm border border-primary/30 bg-primary/5 p-12 text-center">
          <h2 className="font-display text-4xl">WhatsApp message prepared.</h2>
          <p className="mt-4 text-[#555555]">
            Please send the message in WhatsApp so our repair team can reply.
          </p>
        </div>
      ) : (
        <form className="mt-16 grid gap-8" onSubmit={handleSubmit}>
          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="First name" name="firstName" placeholder="First name" required />
            <Field label="Last name" name="lastName" placeholder="Last name" required />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field label="Email" name="email" type="email" placeholder="you@example.com" required />
            <Field label="Phone" name="phone" type="tel" placeholder="07417 556531" required />
          </div>

          <Field
            label="Address / postcode"
            name="address"
            placeholder="Unit, street, town, postcode"
            required
          />

          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              label="Sofa / product type"
              name="productType"
              placeholder="e.g. 3 seater sofa, corner sofa, recliner"
              required
            />
            <div>
              <label htmlFor="issueType" className="text-xs uppercase tracking-widest text-muted-foreground">
                Repair issue *
              </label>
              <select
                id="issueType"
                name="issueType"
                required
                className="mt-2 w-full rounded-sm border border-border bg-white px-4 py-3 text-base shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
                <option value="">Select issue</option>
                {repairIssues.map((issue) => (
                  <option key={issue} value={issue}>
                    {issue}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field
              label="Preferred timeline"
              name="timeline"
              placeholder="e.g. this week, after 6pm, weekend"
            />
            <RepairPhotoUpload
              photoUrl={photoUrl}
              uploading={photoUploading}
              error={photoError}
              onUpload={uploadRepairPhoto}
            />
          </div>

          <div>
            <label htmlFor="details" className="text-xs uppercase tracking-widest text-muted-foreground">
              Repair details *
            </label>
            <textarea
              id="details"
              name="details"
              rows={6}
              required
              className="mt-2 w-full rounded-sm border border-border bg-white px-4 py-3 text-base shadow-sm outline-none transition-colors placeholder:text-muted-foreground/55 focus:border-primary focus:ring-2 focus:ring-primary/15"
              placeholder="Describe the damage, when it happened, size of the area, and anything else we should know."
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-8">
            <p className="text-xs text-muted-foreground">
              Required fields must be filled before WhatsApp opens. Uploading a repair photo is optional.
            </p>
            <button
              type="submit"
              disabled={photoUploading}
              className="w-full rounded-sm bg-primary px-8 py-4 text-xs font-semibold uppercase tracking-[0.14em] text-primary-foreground transition-colors hover:bg-accent sm:w-auto sm:px-10 sm:tracking-[0.2em]"
            >
              {photoUploading ? "Uploading Photo..." : "Send Repair Request"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

function RepairPhotoUpload({
  photoUrl,
  uploading,
  error,
  onUpload,
}: {
  photoUrl: string;
  uploading: boolean;
  error: string;
  onUpload: (file?: File) => void;
}) {
  return (
    <div>
      <label htmlFor="repairPhoto" className="text-xs uppercase tracking-widest text-muted-foreground">
        Product repair photo
      </label>
      <label
        htmlFor="repairPhoto"
        className="mt-2 flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-sm border border-dashed border-primary/35 bg-white px-4 py-5 text-center shadow-sm transition-colors hover:border-primary hover:bg-primary/5"
      >
        {uploading ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span className="mt-3 text-sm font-medium text-secondary">Uploading photo...</span>
          </>
        ) : photoUrl ? (
          <img
            src={photoUrl}
            alt="Repair product preview"
            className="max-h-40 w-full rounded-sm object-cover"
          />
        ) : (
          <>
            <ImageUp className="h-7 w-7 text-primary" />
            <span className="mt-3 text-sm font-medium text-secondary">Upload product photo</span>
            <span className="mt-1 text-xs text-muted-foreground">JPG, PNG, or WebP under 8 MB</span>
          </>
        )}
      </label>
      <input
        id="repairPhoto"
        type="file"
        accept="image/*"
        className="sr-only"
        disabled={uploading}
        onChange={(event) => onUpload(event.target.files?.[0])}
      />
      {photoUrl && (
        <p className="mt-2 break-all text-xs text-muted-foreground">
          Uploaded and attached to this request.
        </p>
      )}
      {error && <p className="mt-2 text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-xs uppercase tracking-widest text-muted-foreground">
        {label}
        {required && " *"}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-2 w-full rounded-sm border border-border bg-white px-4 py-3 text-base shadow-sm outline-none transition-colors placeholder:text-muted-foreground/55 focus:border-primary focus:ring-2 focus:ring-primary/15"
      />
    </div>
  );
}

function slugifyFileName(name: string) {
  const extension = name.split(".").pop()?.toLowerCase() || "jpg";
  const baseName = name
    .replace(/\.[^/.]+$/, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${baseName || "repair-photo"}-${Date.now()}.${extension}`;
}
