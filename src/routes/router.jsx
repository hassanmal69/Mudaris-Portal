import { createBrowserRouter } from "react-router-dom";
import SignUp from "@/features/auth/signup/index.jsx";
import Login from "@/features/auth/login/index.jsx";
import Dashboard from "@/features/dashboard/index.jsx";
import PrivateRoute from "./privateRoute.jsx";
import AdminDashboard from "@/features/admin/admin.jsx";
import AdminRoute from "./adminRoute.jsx";
import WorkSpaceInd from "@/features/dashboard/components/workspaceInd.jsx";
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
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/workspace/:workspaceId",
    element: (
      <PrivateRoute>
        <WorkSpaceInd />
      </PrivateRoute>
    ),
    children: [
      {
        path: "group/:groupId",
        element: <WorkSpaceInd />,
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
