// AppInitializer.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { sessionDetection } from "@/features/auth/authSlice";

export default function AppInitializer({ children }) {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(sessionDetection());
    }, [dispatch]);

    return children;
}
