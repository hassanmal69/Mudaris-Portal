import { useSelector } from "react-redux";
function isAdmin() {
  const { session } = useSelector((state) => state.auth);
  return (isAdmin = session?.user?.user_metadata?.user_role === "admin");
}

export { isAdmin };
