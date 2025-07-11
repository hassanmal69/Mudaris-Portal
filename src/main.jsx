import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router.jsx";
import { AuthContextProvider } from "./context/authContext.jsx";
import "@/styles/global.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </StrictMode>
);
