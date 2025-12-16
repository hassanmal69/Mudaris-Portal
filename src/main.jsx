// main.jsx / index.jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { router } from "./routes/router.jsx";
import { store } from "./redux/app/store.js";
import { supabase } from "@/services/supabaseClient";
import { setSession } from "@/redux/features/auth/authSlice";
import AppInitializer from "./appInitializer.jsx";
import "@/styles/global.css";

supabase.auth.onAuthStateChange((_event, session) => {
  store.dispatch(
    setSession({
      session,
      token: session?.access_token ?? null,
    })
  );
});
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AppInitializer>
        <RouterProvider router={router} />
      </AppInitializer>
    </Provider>
  </StrictMode>
);
