// AppInitializer.jsx
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  initAuthListener,
  sessionDetection,
} from "@/redux/features/auth/authSlice.js";

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
