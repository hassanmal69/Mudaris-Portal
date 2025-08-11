import { createBrowserRouter, Outlet } from "react-router-dom";
import SignUp from "@/pages/auth/signup/index.jsx";
import Login from "@/pages/auth/login/index.jsx";
import Dashboard from "@/pages/dashboard/index.jsx";
import PrivateRoute from "./privateRoute.jsx";
import AdminDashboard from "@/pages/admin/admin.jsx";
import AdminRoute from "./adminRoute.jsx";
import WorkSpaceInd from "@/pages/dashboard/components/workspaceInd.jsx";
import AppLayout from "@/layout/AppLayout.jsx";
import Topbar from "@/layout/topbar/index.jsx";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },

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
        <WorkspaceLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "",
        element: <WorkSpaceInd />, // default when /workspace/:workspaceId
      },
      {
        path: "group/:groupId",
        element: <WorkSpaceInd />, // or another group-specific component
      },
    ],
  },

  {
    path: "/invite/verify",
    element: <SignUp />,
  },
  {
    path: "/admindashboard",
    element: (
      // <AdminRoute>
      <AdminDashboard />
      // </AdminRoute>
    ),
  },
]);

function WorkspaceLayout() {
  return (
    <AppLayout>
      <div className="flex flex-col w-full">
        <Topbar />
        <div className="flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </AppLayout>
  );
}
