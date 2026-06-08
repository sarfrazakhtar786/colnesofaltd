import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Inbox, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { type RequestStatus, requestStatuses } from "@/lib/submissions";

type SubmissionType = "quote" | "contact" | "repair";

type AdminSubmission = {
  id: string;
  type: SubmissionType;
  created_at: string;
  status: RequestStatus;
  name: string;
  email: string;
  phone: string;
  subject: string;
  detail: string;
};

export const Route = createFileRoute("/admin/submissions/")({
  component: AdminSubmissions,
});

function AdminSubmissions() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | SubmissionType>("all");
  const [submissions, setSubmissions] = useState<AdminSubmission[]>([]);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    setLoading(true);
    const [quoteRes, contactRes, repairRes] = await Promise.all([
      supabase.from("quote_requests").select("*").order("created_at", { ascending: false }),
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("repair_requests").select("*").order("created_at", { ascending: false }),
    ]);

    const quoteRows =
      quoteRes.data?.map((row) => ({
        id: row.id,
        type: "quote" as const,
        created_at: row.created_at,
        status: row.status || "New",
        name: `${row.first_name || ""} ${row.last_name || ""}`.trim(),
        email: row.email || "",
        phone: row.phone || "",
        subject: row.product_model || "Quote request",
        detail: row.details || "",
      })) || [];

    const contactRows =
      contactRes.data?.map((row) => ({
        id: row.id,
        type: "contact" as const,
        created_at: row.created_at,
        status: row.status || "New",
        name: `${row.first_name || ""} ${row.last_name || ""}`.trim(),
        email: row.email || "",
        phone: row.phone || "",
        subject: row.subject || "Contact message",
        detail: row.message || "",
      })) || [];

    const repairRows =
      repairRes.data?.map((row) => ({
        id: row.id,
        type: "repair" as const,
        created_at: row.created_at,
        status: row.status || "New",
        name: `${row.first_name || ""} ${row.last_name || ""}`.trim(),
        email: row.email || "",
        phone: row.phone || "",
        subject: row.issue_type || "Repair request",
        detail: [
          row.product_type && `Product: ${row.product_type}`,
          row.address && `Address / postcode: ${row.address}`,
          row.preferred_timeline && `Timeline: ${row.preferred_timeline}`,
          row.photo_url && `Photo URL: ${row.photo_url}`,
          row.details && "",
          row.details,
        ]
          .filter(Boolean)
          .join("\n"),
      })) || [];

    setSubmissions(
      [...quoteRows, ...contactRows, ...repairRows].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      ),
    );
    setLoading(false);
  }

  async function updateStatus(submission: AdminSubmission, status: RequestStatus) {
    const table =
      submission.type === "quote"
        ? "quote_requests"
        : submission.type === "repair"
          ? "repair_requests"
          : "contact_submissions";
    const { error } = await supabase.from(table).update({ status }).eq("id", submission.id);

    if (error) {
      alert("Status update failed: " + error.message);
      return;
    }

    setSubmissions((current) =>
      current.map((item) => (item.id === submission.id ? { ...item, status } : item)),
    );
  }

  const filteredSubmissions =
    filter === "all" ? submissions : submissions.filter((item) => item.type === filter);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display">Requests Inbox</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Contact messages, quote requests, and repair requests saved from the website forms.
          </p>
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "all" | SubmissionType)}
          className="h-10 rounded-md border border-input bg-white px-3 text-sm shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">All requests</option>
          <option value="quote">Quote requests</option>
          <option value="repair">Repair requests</option>
          <option value="contact">Contact messages</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredSubmissions.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 p-12 text-center text-muted-foreground">
            <Inbox className="h-8 w-8" />
            <p>No requests found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSubmissions.map((submission) => (
            <Card key={`${submission.type}-${submission.id}`}>
              <CardContent className="grid gap-4 p-5 lg:grid-cols-[1fr_180px]">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={
                        submission.type === "quote"
                          ? "default"
                          : submission.type === "repair"
                            ? "outline"
                            : "secondary"
                      }
                    >
                      {submission.type === "quote"
                        ? "Quote"
                        : submission.type === "repair"
                          ? "Repair"
                          : "Contact"}
                    </Badge>
                    <Badge variant="outline">{submission.status}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(submission.created_at).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-display text-2xl">{submission.subject}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {submission.name || "No name"} · {submission.email} · {submission.phone}
                    </p>
                  </div>
                  <p className="whitespace-pre-wrap text-sm leading-relaxed text-[#555555]">
                    {submission.detail || "No message details provided."}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
                    Status
                  </label>
                  <select
                    value={submission.status}
                    onChange={(e) =>
                      updateStatus(submission, e.target.value as RequestStatus)
                    }
                    className="h-10 w-full rounded-md border border-input bg-white px-3 text-sm shadow-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {requestStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
