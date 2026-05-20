import { supabase } from "@/lib/supabase";

export type RequestStatus = "New" | "Contacted" | "Quoted" | "Closed";

export type ContactSubmissionInput = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export type QuoteRequestInput = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  product_model: string;
  fabric: string;
  dimensions: string;
  city: string;
  timeline: string;
  details: string;
};

export const requestStatuses: RequestStatus[] = ["New", "Contacted", "Quoted", "Closed"];

export async function saveContactSubmission(input: ContactSubmissionInput) {
  return supabase.from("contact_submissions").insert([{ ...input, status: "New" }]);
}

export async function saveQuoteRequest(input: QuoteRequestInput) {
  return supabase.from("quote_requests").insert([{ ...input, status: "New" }]);
}
