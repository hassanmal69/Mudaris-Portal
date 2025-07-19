import React, { useEffect, useState, Suspense } from "react";
const Groups = React.lazy(() => import("./group.jsx"));

import { useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabaseClient.js";
import { useParams } from "react-router-dom";
const InviteSend = React.lazy(() => import("./invitationsent.jsx"));

import { useSelector } from "react-redux";
const Chat = React.lazy(() => import("./chat.jsx"));
const Members = React.lazy(() => import("./members.jsx"));

const WorkSpaceInd = () => {
  const { workspaceId, groupId } = useParams();
  const navigate = useNavigate();
  const { logOut, session } = useSelector((state) => state.auth);
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
    if (!groupId)
      navigate(`/workspace/${workspaceId}/group/${data[0].id}`, {
        replace: true,
      });
  };
  useEffect(() => {
    fetchGroups();
  }, [workspaceId, groupId, session]);
  const handleLogout = () => {
    logOut();
  };
  const toggleScreen = () => {
    setisScreen((prev) => !prev);
  };
  return (
    <div className="flex h-[100vh] w-full relative text-amber-50">
      <Suspense fallback={<div>Loading Members...</div>}>
        {isScreen && <Members />}
      </Suspense>
      <div className="w-full h-15 bg-gray-500 absolute flex justify-center">
        <h1>Top Bar</h1>
        <button onClick={toggleScreen}>view all members</button>
      </div>
      <div className="flex flex-col bg-gray-900 h-full justify-center items-center">
        <Suspense fallback={<div>Loading groups...</div>}>
          <Groups workspaceId={workspaceId} />
        </Suspense>
        <Suspense fallback={<div>Loading invite...</div>}>
          <InviteSend />
        </Suspense>
        <button onClick={handleLogout}>LOG OUT</button>
      </div>
      {/* ✅ Lazy-load Chat */}
      <Suspense fallback={<div>Loading Chat...</div>}>
        <Chat />
      </Suspense>
    </div>
  );
};

export default WorkSpaceInd;
