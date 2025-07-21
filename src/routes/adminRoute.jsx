import { Navigate } from "react-router-dom";
import { supabase } from "../services/supabaseClient";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
const AdminRoute = ({ children }) => {
  const { session } = useSelector((state) => state.auth);
  const [authorized, setAuthorized] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const checkUa = async () => {
      const userId = session.user?.id;
      if (!userId) {
        setAuthorized(false);
        return;
      }

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) throw error;
      const role = user?.user_metadata?.role;

      if (error || !user || role !== "admin") {
        setAuthorized(false);
      } else {
        setAuthorized(true);
      }
      setLoading(false);
    };
    checkUa();
  }, [session]);
  if (loading) return <>loading.......</>;
  if (!authorized) return <Navigate to="/" />;
  return children;
};

export default AdminRoute;
