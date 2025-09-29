import { supabase } from "@/services/supabaseClient";
const LIST_USERS_URL =
  "https://surdziukuzjqthcfqoax.supabase.co/functions/v1/list-auth-users";

/**
 * Fetch all users from Supabase Edge Function
 */
export async function getAllUsers() {
  const session = (await supabase.auth.getSession()).data.session;
  if (!session) {
    throw new Error("User is not logged in");
  }

  const res = await fetch(LIST_USERS_URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (!res.ok) {
    let message = `Request failed with status ${res.status}`;
    try {
      const errObj = await res.json();
      if (errObj?.error) message = errObj.error;
    } catch {}
    throw new Error(message);
  }

  const data = await res.json();
  return data.users || [];
}

// updateUserRole.js
export async function updateUserRole(userId, role) {
  const session = (await supabase.auth.getSession()).data.session;
  if (!session) {
    throw new Error("User is not logged in");
  }

  const res = await fetch(
    "https://surdziukuzjqthcfqoax.supabase.co/functions/v1/update-user-role",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ userId, role }),
    }
  );

  if (!res.ok) throw new Error("Failed to update role");
  return res.json();
}
