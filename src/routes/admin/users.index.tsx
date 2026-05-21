import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, Loader2, ShieldCheck, Trash2, UserPlus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase";

type AdminUser = {
  id: string;
  user_id: string | null;
  email: string;
  created_at: string;
};

export const Route = createFileRoute("/admin/users/")({
  component: AdminUsers,
});

function AdminUsers() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [newEmail, setNewEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAdminUsers();
  }, []);

  async function fetchAdminUsers() {
    setLoading(true);
    setError("");

    const { data, error: fetchError } = await supabase
      .from("admin_users")
      .select("id, user_id, email, created_at")
      .order("created_at", { ascending: true });

    if (fetchError) {
      setError(fetchError.message);
      setAdminUsers([]);
    } else {
      setAdminUsers(data || []);
    }

    setLoading(false);
  }

  async function addAdminUser(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const email = newEmail.trim().toLowerCase();
    if (!email) {
      setError("Please enter an admin email.");
      return;
    }

    if (adminUsers.some((admin) => admin.email.toLowerCase() === email)) {
      setError("This email is already an admin.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const { error: insertError } = await supabase.from("admin_users").insert({ email });

    if (insertError) {
      setError(insertError.message);
    } else {
      setMessage(`${email} has been added as an admin.`);
      setNewEmail("");
      await fetchAdminUsers();
    }

    setSaving(false);
  }

  async function removeAdminUser(admin: AdminUser) {
    if (adminUsers.length <= 1) {
      setError("You cannot remove the last admin user.");
      return;
    }

    const confirmed = confirm(`Remove admin access for ${admin.email}?`);
    if (!confirmed) {
      return;
    }

    setError("");
    setMessage("");

    const { error: deleteError } = await supabase.from("admin_users").delete().eq("id", admin.id);

    if (deleteError) {
      setError(deleteError.message);
      return;
    }

    setMessage(`${admin.email} has been removed from admin users.`);
    setAdminUsers((current) => current.filter((item) => item.id !== admin.id));
  }

  const sortedAdmins = useMemo(
    () => [...adminUsers].sort((a, b) => a.email.localeCompare(b.email)),
    [adminUsers],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display">Admin Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Control which authenticated emails can open the admin panel.
        </p>
      </div>

      {error && (
        <div className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Current Admins
            </CardTitle>
            <Badge variant="outline">{adminUsers.length} total</Badge>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : sortedAdmins.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-md border border-dashed p-10 text-center text-muted-foreground">
                <AlertTriangle className="h-8 w-8" />
                <p>No admin users found. Add one before logging out.</p>
              </div>
            ) : (
              <div className="divide-y rounded-md border bg-background">
                {sortedAdmins.map((admin) => (
                  <div
                    key={admin.id}
                    className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-medium">{admin.email}</p>
                        <Badge variant={admin.user_id ? "default" : "secondary"}>
                          {admin.user_id ? "Linked user" : "Email allowed"}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Added {new Date(admin.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => removeAdminUser(admin)}
                      disabled={adminUsers.length <= 1}
                      className="shrink-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-primary" />
                Add Admin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={addAdminUser} className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="admin-email">Email address</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@example.com"
                    value={newEmail}
                    onChange={(event) => setNewEmail(event.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Add admin user
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="flex gap-3 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed text-muted-foreground">
                Add the same email that will be used in Supabase Authentication. The person still
                needs a valid Supabase login before this whitelist gives admin access.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
