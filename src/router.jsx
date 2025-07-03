import React from "react";
import { createBrowserRouter } from "react-router-dom";
import SignUp from "./signup";
import App from "./App";
import Login from "./login";
import Dashboard from "./dashboard/index.jsx";
import PrivateRoute from './privateRoute.jsx';
import AdminDashboard from './admin/admin.jsx';
import AdminRoute from './adminRoute.jsx'
import WorkSpaceInd from "./dashboard/workspaceind.jsx";
import Invitation from "./dashboard/Invitation.jsx";
export const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />
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
        path: '/dashboard',
        element: (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
        )
    },
    {

        path: '/workspace/:workspaceId',
        element: (
            <PrivateRoute>
                <WorkSpaceInd />
            </PrivateRoute>
        ),
        children: [
            {
                path: 'group/:groupId',
                element: <WorkSpaceInd />
            }
        ]
    },
    {
        path: '/invite/verify',
        element: (
            <SignUp />
        )
    },
    {
        path: '/admindashboard',
        element: (
            <AdminRoute>
                <AdminDashboard />
            </AdminRoute>
        )
    }
]);
