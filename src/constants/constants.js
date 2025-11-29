import { useSelector } from "react-redux";

export function useIsAdmin() {
  const { session } = useSelector((state) => state.auth);
  return session?.user?.user_metadata?.user_role === "admin";
}


