import React, { useEffect, useState, Suspense } from "react";
const Groups = React.lazy(() => import("./group.jsx"));

import { supabase } from "@/services/supabaseClient.js";
import { useParams } from "react-router-dom";
const InviteSend = React.lazy(() => import("./invitationsent.jsx"));

import { useSelector } from "react-redux";
import EditProfile from "@/pages/profile/components/editProfile.jsx";
const Chat = React.lazy(() => import("../../chat/index.jsx"));
const Members = React.lazy(() => import("./members.jsx"));

const WorkSpaceInd = () => {
  const { workspaceId, groupId } = useParams();
  const { session } = useSelector((state) => state.auth);
  const editProfileOpen = useSelector((state) => state.profile.editProfileOpen);
  return (
    <div className="flex h-[100vh] w-full relative text-black">
      <div
        className={`absolute h-full w-full flex pointer-events-none justify-center z-[9999] items-center ${editProfileOpen ? "block" : "hidden"
          }`}
      >
        <EditProfile />
      </div>
      <Suspense fallback={<div>Loading Chat...</div>}>
        <Chat />
      </Suspense>
    </div>
  );
};

export default WorkSpaceInd;
