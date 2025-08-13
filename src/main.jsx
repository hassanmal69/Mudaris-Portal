import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router.jsx";
import "@/styles/global.css";
import { store } from "./app/store.js";
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

const log = (valName, val) => {
  console.log(`i am ${valName}`, val);
};
