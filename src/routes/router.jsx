import { createBrowserRouter, Outlet } from "react-router-dom";
import SignUp from "@/pages/auth/signup/index.jsx";
import Login from "@/pages/auth/login/index.jsx";
import Dashboard from "@/pages/dashboard/index.jsx";
import PrivateRoute from "./privateRoute.jsx";
import AdminDashboard from "@/pages/admin/admin.jsx";
import AdminRoute from "./adminRoute.jsx";
import WorkSpaceInd from "@/pages/dashboard/components/workspaceInd.jsx";
import Sidebar from "@/layout/sidebar/index.jsx";
import Topbar from "@/layout/topbar/index.jsx";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  // {
  //     path: '/dashboard',
  //     element: (
  //         <AdminRoute>
  //             <Dashboard />
  //         </AdminRoute>
  //     )
  // },
  {
    path: "/dashboard",
    element: (
      // <PrivateRoute>
      <Dashboard />
      // </PrivateRoute>
    ),
  },
  {
    path: "/workspace/:workspaceId",
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
    <>
      <Topbar />
      <Sidebar />
      <Outlet />
    </>
  );
}
