import { useEffect, useState, createContext, useContext } from "react";
import { supabase } from "@/services/supabaseClient";

const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Fetch current session on mount
    const localSession = localStorage.getItem("session");
    if (localSession) {
      setSession(JSON.parse(localSession));
    }
  }, []);

  const logOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    localStorage.removeItem("session");
  };

  return (
    <AuthContext.Provider value={{ session, logOut, setSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  return useContext(AuthContext);
};
