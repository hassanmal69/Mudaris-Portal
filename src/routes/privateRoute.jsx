import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
export const PrivateRoute = ({ children }) => {
  const location = useLocation();

  const { session, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <p>Loading…</p>;
  }

  if (!session) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
};

// ProtectedRoute.jsx

export default function OnlyAdmin({ children }) {
  const { session, loading } = useSelector((state) => state.auth);

  // ✅ Wait until auth state is resolved
  if (loading) {
    return <p>Loading…</p>;
  }

  const user = session?.user;

  // ✅ Block if not YOU
  if (!user || user?.email !== "admin@gmail.com") {
    return <Navigate to="/" replace />;
  }

  return children;
}
