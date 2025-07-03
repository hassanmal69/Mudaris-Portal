import { UserAuth } from './context/authContext';
import { Navigate } from 'react-router-dom';
import { supabase } from './supabaseClient';
import { useEffect, useState } from 'react';
const AdminRoute = ({ children }) => {
  const { session } = UserAuth();
  const [authorized, setAuthorized] = useState(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const checkUa = async () => {
      const userId = session.user?.id
      if (!userId) {
        setAuthorized(false);
        return;
      }
      const { data, error } = await supabase.from('user').select('role').eq('id', userId).single();
      if (error || !data || data.role !== 'admin') {
        setAuthorized(false)
      } else {
        setAuthorized(true)
      }
      setLoading(false)
    }
    checkUa();
  }, [session])
  if (loading) return <>loading.......</>
  if (!authorized) return <Navigate to="/" />
  return children;
};

export default AdminRoute;