import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import { UserAuth } from "@/context/authContext";

/**
 * Custom hook to handle session-based redirection.
 * - Admins: /dashboard
 * - Users: /workspace/:workspaceId/group/:groupId
 *
 * @param {boolean} enableRedirect - If true, will redirect based on session.
 */
export function useSessionRedirect(enableRedirect = true) {
  const { session } = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!enableRedirect || !session) return;

    const checkRoleAndRedirect = async () => {
      try {
        console.log(session?.user.email, "session in useSessionRedirect.js");
        // Fetch user role
        const { data: userData, error: userError } = await supabase
          .from("user")
          .select("role, email")
          .eq("email", session.user?.email)
          .single();
        if (userError) throw userError;
        if (!userData) return;

        if (userData.role === "admin") {
          navigate("/dashboard", { replace: true });
        } else {
          // Fetch workspace/group for this user
          const { data: wsData, error: wsError } = await supabase
            .from("invitations")
            .select("workspaceId, groupId")
            .eq("email", session.user?.email);
          if (wsError) throw wsError;
          if (wsData && wsData.length > 0) {
            const { workspaceId, groupId } = wsData[0];
            navigate(`/workspace/${workspaceId}/group/${groupId}`, {
              replace: true,
            });
          }
        }
      } catch (err) {
        console.error("Session redirect error:", err);
      }
    };
    checkRoleAndRedirect();
    // Only run on session change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, enableRedirect]);
}
