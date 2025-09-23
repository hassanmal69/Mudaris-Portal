import { supabase } from "@/services/supabaseClient.js";
export default async function createInvitation({ email, workspace_id }) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("invitations")
    .insert([
      {
        email,
        workspace_id,
        token,
        expires_at: expiresAt,
      },
    ])
    .select();
  if (error) {
    console.error("Error creating invitation:", error);
    return null;
  }
  return `${window.location.origin}/invite/verify?token=${token}`;
}
