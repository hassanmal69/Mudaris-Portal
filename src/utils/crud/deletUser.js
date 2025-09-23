import { supabase } from "@/services/supabaseClient.js";
export async function deleteUser(userId) {
  const { data, error } = await supabase.auth.admin.deleteUser(userId);

  if (error) {
    console.error("Error deleting user:", error.message);
    return null;
  }

  console.log("Deleted user:", data);
  return data;
}
