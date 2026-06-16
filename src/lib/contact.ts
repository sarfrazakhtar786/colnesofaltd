export type ContactDetails = {
  addressLines: string[];
  email: string;
  phoneDisplay: string;
  whatsappNumber: string;
  hours: string;
  footerText: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    linkedin: string;
    youtube: string;
  };
};

export const defaultContactDetails: ContactDetails = {
  addressLines: ["Colne Sofa LTD", "Unit 5 Priverside Mil", "Greenfield Road", "BB8 9PE"],
  email: "colnesofaltd@gmail.com",
  phoneDisplay: "07417 556531",
  whatsappNumber: "447417556531",
  hours: "Mon-Sat 10:00 - 18:00",
  footerText:
    "Hand-crafted sofas, beds, and repair services made with practical comfort, durable materials, and a quiet sense of luxury.",
  socialLinks: {
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
  },
};

export const contactDetails = {
  ...defaultContactDetails,
  phoneHref: getPhoneHref(defaultContactDetails.phoneDisplay),
};

export function getPhoneHref(phoneDisplay: string) {
  const digits = phoneDisplay.replace(/\D/g, "");
  if (digits.startsWith("0")) return `tel:+44${digits.slice(1)}`;
  if (digits.startsWith("44")) return `tel:+${digits}`;
  return `tel:${phoneDisplay}`;
}

export function normalizeContactDetails(value: Partial<ContactDetails> | null | undefined) {
  return {
    ...defaultContactDetails,
    ...value,
    socialLinks: {
      ...defaultContactDetails.socialLinks,
      ...(value?.socialLinks || {}),
    },
    addressLines:
      Array.isArray(value?.addressLines) && value.addressLines.length > 0
        ? value.addressLines
        : defaultContactDetails.addressLines,
  };
}

export async function fetchContactDetails() {
  const { supabase } = await import("@/lib/supabase");
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "contact_details")
    .maybeSingle();

  return normalizeContactDetails(data?.value as Partial<ContactDetails> | undefined);
}
