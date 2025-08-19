// AppInitializer.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { initAuthListener, sessionDetection } from "@/features/auth/authSlice";

export default function AppInitializer({ children }) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(sessionDetection());
        const subscription = dispatch(initAuthListener());

        return () => {
            subscription.unsubscribe();
        };
    }, [dispatch]);

    return children;
}
