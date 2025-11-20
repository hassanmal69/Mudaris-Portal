import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  initAuthListener,
  sessionDetection,
} from "@/redux/features/auth/authSlice.js";

export default function AppInitializer({ children }) {
  const dispatch = useDispatch();
  const [mode, setMode] = useState(localStorage.getItem("theme") || "dark");
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", mode);
  }, [mode]);

  useEffect(() => {
    dispatch(sessionDetection());
    const subscription = dispatch(initAuthListener());

    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch]);

  return children;
}
