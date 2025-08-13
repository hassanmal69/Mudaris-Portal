import React, { useEffect, useState, Suspense } from "react";
const Groups = React.lazy(() => import("./group.jsx"));

import { useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabaseClient.js";
import { useParams } from "react-router-dom";
const InviteSend = React.lazy(() => import("./invitationsent.jsx"));

import { useSelector } from "react-redux";
import EditProfile from "@/components/ui/editProfile.jsx";
const Chat = React.lazy(() => import("../../chat/index.jsx"));
const Members = React.lazy(() => import("./members.jsx"));

const WorkSpaceInd = () => {
  const { workspaceId, groupId } = useParams();
  const navigate = useNavigate();
  const { logOut, session } = useSelector((state) => state.auth);
  const editProfileOpen = useSelector((state) => state.profile.editProfileOpen);
  const [groups, setGroups] = useState([]);
  const [email, setEmail] = useState("");
  const [isScreen, setisScreen] = useState(false);
  const fetchGroups = async () => {
    //we all doing this so we can send a user
    //  when he creates a first channel
    const { data, error } = await supabase
      .from("channels")
      .select("id,channel_name")
      .eq("workspace_Id", workspaceId)
      .order("created_at", { ascending: true });
    if (!error && data.length > 0) {
      setGroups(data);
    }
    setEmail(session.user.email);
  };
  useEffect(() => {
    fetchGroups();
  }, [workspaceId, groupId, session]);
  return (
    <div className="flex h-[100vh] w-full relative text-black">
      <div
        className={`absolute h-full w-full flex pointer-events-none justify-center z-[9999] items-center ${
          editProfileOpen ? "block" : "hidden"
        }`}
      >
        <EditProfile />
      </div>

      {/* <div className="w-full h-15 bg-gray-500 absolute flex justify-center">
        <h1>uaa topbar</h1>
        <button onClick={toggleScreen}>view all members</button>
      </div> */}
      {/* <div className="flex flex-col bg-purple-900 h-full justify-center items-center">
        baaa
        <Suspense fallback={<div>Loading groups...</div>}>
          <Groups workspaceId={workspaceId} />
        </Suspense>
        <Suspense fallback={<div>Loading invite...</div>}>
          <InviteSend />
        </Suspense>
        <button onClick={handleLogout}>LOG OUT</button>
      </div> */}
      {/* ✅ Lazy-load Chat */}
      {/* <Suspense fallback={<div>Loading Chat...</div>}>
        <Chat />
      </Suspense> */}
    </div>
  );
};

export default WorkSpaceInd;
