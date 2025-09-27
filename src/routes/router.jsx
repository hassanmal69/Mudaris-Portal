import { createBrowserRouter, Outlet } from "react-router-dom";
import SignUp from "@/pages/auth/signup/index.jsx";
import Login from "@/pages/auth/login/index.jsx";
import Dashboard from "@/pages/dashboard/index.jsx";
import PrivateRoute from "./privateRoute.jsx";
import WorkSpaceInd from "@/pages/dashboard/components/workspaceind.jsx";
import SidebarLayout from "@/layout/SidebarLayout.jsx";
import Topbar from "@/layout/topbar/index.jsx";
import ThemeLayout from "@/layout/ThemeLayout.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/invite/verify",
    element: <SignUp />,
  },

  // ✅ All themed pages wrapped
  {
    element: <ThemeLayout />, // theme applied here
    children: [
      {
        path: "/dashboard/:adminId",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/workspace/:workspace_id",
        element: (
          <PrivateRoute>
            {/* <ThemeLayout> */}
            <WorkspaceLayout />
            {/* </ThemeLayout> */}
          </PrivateRoute>
        ),
        children: [
          { path: "", element: <WorkSpaceInd /> },
          { path: "group/:groupId", element: <WorkSpaceInd /> },
          //here below user_id is not user_id but basically it's a token which
          //is made from combining both sender id and reciever id
          { path: "individual/:user_id", element: <WorkSpaceInd /> },
        ],
      },
    ],
  },
]);

function WorkspaceLayout() {
  return (
    <div className="bg-black">
    <SidebarLayout >
      <Topbar />
      <Outlet />
    </SidebarLayout>
    </div>
  );
}
