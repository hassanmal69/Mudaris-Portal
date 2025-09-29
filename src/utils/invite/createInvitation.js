import { supabase } from "@/services/supabaseClient.js";
export default async function createInvitation({
  email,
  workspace_id,
  allowedChannels,
}) {
  const token = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  //handling giving the allowed channels as well for public
  // channels on workspace

  const { error } = await supabase
    .from("invitations")
    .insert([
      {
        email,
        workspace_id,
        token,
        allowedChannels,
        expires_at: expiresAt,
      },
    ])
    .select();

  if (error) {
    console.error("Error creating invitation:", error);
    return null;
  }
  return `https://mudaris-portal.vercel.app/invite/verify?token=${token}`;
}
