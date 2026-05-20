import { supabase } from "@/lib/supabase";

export async function isCurrentUserAdmin(userId: string, email?: string | null) {
  const { data, error } = await supabase
    .from("admin_users")
    .select("user_id, email")
    .or(`user_id.eq.${userId},email.eq.${email || ""}`)
    .maybeSingle();

  if (error) {
    console.warn("Admin access check failed:", error.message);
    return false;
  }

  return Boolean(data);
}
