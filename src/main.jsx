import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router.jsx";
import "@/styles/global.css";
import { store } from "./redux/app/store.js";
import { Provider } from "react-redux";
import AppInitializer from "./appInitializer.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AppInitializer>
        <RouterProvider router={router} />
      </AppInitializer>
    </Provider>
  </StrictMode>
);

// 12 wh for videos and presentations channel --- supabase
// 16 wh for videos and presentations channel --- User interface
// 8 wh for lectures link and presentations channel --- User interface and supabase
// 8 wh for anouncements channel --- User interface and supabase
