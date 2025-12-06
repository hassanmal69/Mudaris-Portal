import { useSelector } from "react-redux";

export function useIsAdmin() {
  const userRole = useSelector(
    (state) => state.auth.user?.user_metadata?.user_role
  );
  return userRole === "admin";
}
