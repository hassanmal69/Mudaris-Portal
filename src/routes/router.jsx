import { createBrowserRouter, Outlet } from "react-router-dom";
import SignUp from "@/pages/auth/signup/index.jsx";
import Login from "@/pages/auth/login/index.jsx";
import Dashboard from "@/pages/dashboard/index.jsx";
import OnlyAdmin, { PrivateRoute } from "./privateRoute.jsx";
import WorkSpaceInd from "@/pages/dashboard/components/workspaceind.jsx";
import SidebarLayout from "@/layout/SidebarLayout.jsx";
import Topbar from "@/layout/topbar/index.jsx";
import ThemeLayout from "@/layout/ThemeLayout.jsx";
import UsersList from "@/pages/admin/index.jsx";
import Calendar from "@/pages/calendar/index.jsx";
// const Market = () => {
//   return (
//     <div className="overflow-hidden">
//       <div style={{ height: "100vh", width: "100%", backgroundColor: "#fff" }}>
//         <iframe
//           src="https://capital-template.beehiiv.com/"
//           width="100%"
//           height="100%"
//           style={{ border: "none" }}
//           title="Market Insight"
//         ></iframe>
//       </div>
//     </div>
//   );
// };
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
      // {
      //   path: "/market",
      //   element: (
      //     <PrivateRoute>
      //       <Market />
      //     </PrivateRoute>
      //   ),
      // },
      {
        path: "/seeAllUsers",
        element: (
          <OnlyAdmin>
            <UsersList />
          </OnlyAdmin>
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
          { path: "", element: <WorkSpaceInd /> },
          { path: "calendar", element: <Calendar /> },
          { path: "group/:groupId", element: <WorkSpaceInd /> },
          { path: "individual/:token", element: <WorkSpaceInd /> },
        ],
      },
    ],
  },
]);

function WorkspaceLayout() {
  return (
    <div className="bg-black">
      <SidebarLayout>
        <Topbar />
        <Outlet />
      </SidebarLayout>
    </div>
  );
}
