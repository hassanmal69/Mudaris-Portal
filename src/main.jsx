import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router.jsx";
import "@/styles/global.css";
import { store } from "./redux/app/store.js";
import { Provider } from "react-redux";
import AppInitializer from "./appInitializer.jsx";
import "./wdyr.js";
createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider store={store}>
    <AppInitializer>
      <RouterProvider router={router} />
    </AppInitializer>
  </Provider>
  // </StrictMode>
);
