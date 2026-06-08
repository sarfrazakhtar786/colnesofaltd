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

export type RepairRequestInput = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  product_type: string;
  issue_type: string;
  preferred_timeline: string;
  photo_url: string;
  details: string;
};

export const requestStatuses: RequestStatus[] = ["New", "Contacted", "Quoted", "Closed"];

export async function saveContactSubmission(input: ContactSubmissionInput) {
  return supabase.from("contact_submissions").insert([{ ...input, status: "New" }]);
}

export async function saveQuoteRequest(input: QuoteRequestInput) {
  return supabase.from("quote_requests").insert([{ ...input, status: "New" }]);
}

export async function saveRepairRequest(input: RepairRequestInput) {
  return supabase.from("repair_requests").insert([{ ...input, status: "New" }]);
}
