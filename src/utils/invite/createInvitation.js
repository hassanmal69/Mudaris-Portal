import { supabase } from "@/services/supabaseClient";
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

const handleInviteLink = async (token) => {
  const { data, error } = await supabase
    .from("invitations")
    .select("*")
    .eq("token", token)
    .single();

  if (error || !data) {
    return {
      status: "error",
      message: "invalid or expired link",
    };
  }

  if (data.expiry_date) {
    const now = new Date();
    const expiry = new Date(data.expiry_date);

    if (now > expiry) {
      return { status: "error", message: "Invitation link has expired" };
    }
  }

  if (data.status !== "pending") {
    return {
      status: "error",
      message: "Invitation already accepted or declined",
    };
  }

  await supabase
    .from("invitations")
    .update({ status: "accepted" })
    .eq("token", token);
  return {
    status: "success",
    message: "Invitation accepted successfully",
    data,
  };
};
