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
import Market from "@/pages/market/index.jsx";
import Announcements from "@/pages/channels/announcements/index.jsx";
import LecturesLink from "@/pages/channels/lecturesLink/index.jsx";
import HandleChatsViewer from "@/pages/chatsViewer/index.jsx";
import ChatGet from "@/pages/chatsViewer/chatGet/index.jsx";

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
        path: "/seeAllUsers",
        element: (
          <OnlyAdmin>
            <UsersList />
          </OnlyAdmin>
        ),
      },
      {
        path: "/seePersonalChats",
        element: (
          <OnlyAdmin>
            <HandleChatsViewer />
          </OnlyAdmin>
        ),
      },
      {
        path: "/seePersonalChats/:token",
        element: (
          <OnlyAdmin>
            <ChatGet />
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
          { path: "announcements", element: <Announcements /> },
          { path: "lecturesLink", element: <LecturesLink /> },
          { path: "calendar", element: <Calendar /> },
          { path: "market", element: <Market /> },
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
