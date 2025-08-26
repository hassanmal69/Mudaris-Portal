import React, { useEffect, useState, Suspense } from "react";
import { supabase } from "@/services/supabaseClient.js";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import EditProfile from "@/pages/profile/components/editProfile.jsx";
const Chat = React.lazy(() => import("../../chat/index.jsx"));

const WorkSpaceInd = () => {
  const { workspaceId, groupId } = useParams();
  const { session } = useSelector((state) => state.auth);
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
    <div className="flex w-full h-[90vh]">
      <div
        className={`absolute h-full w-full flex pointer-events-none justify-center z-[9999] items-center ${
          editProfileOpen ? "block" : "hidden"
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
