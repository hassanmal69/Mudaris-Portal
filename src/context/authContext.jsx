import React, { useEffect } from "react";
import { createContext, useContext, useState } from "react";
const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
    const [session, setSession] = useState(null)
    useEffect(() => {
        const localSession = localStorage.getItem('session');
        if (localSession) {
            setSession(JSON.parse(localSession));
        }
    }, []);
    const logOut = () => {
        setSession(null)
        localStorage.removeItem('session')
    }
    return (
        <AuthContext.Provider value={{ session, logOut, setSession }}>{children}</AuthContext.Provider>
    )
}
export const UserAuth = () => {
    return useContext(AuthContext)
}