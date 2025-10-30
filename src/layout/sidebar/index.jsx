import React, { useEffect, useState } from "react";
import AddChannelDialog from "@/components/add-channel-dialog";
import InviteDialog from "@/components/invite-dialog";
import {
  SidebarContent,
} from "@/components/ui/sidebar";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
// import { newDirect } from "@/features/channels/directSlice";
import { supabase } from "@/services/supabaseClient";
import { logOut } from "@/features/auth/authSlice.js";
import SideBarHeader from "./components/sideBarHeader";
import SideBarChannels from "./components/sideBarChannels";
import SideBarApps from "./components/sideBarApps";
import SideBarFooter from "./components/sideBarFooter";

const Sidebar = () => {
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const { session } = useSelector((state) => state.auth);
  const [addChannelOpen, setAddChannelOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const { workspace_id, groupId } = useParams();
  const handleLogout = () => {
    dispatch(logOut());
  };

  const fetchAdminOnly = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select(`
    auth_user:auth.users(email)
  `);

    if (error) {
      console.log('error arha jo abhi kia', error);
    }
    console.log('data arha jo abhi kia', data);
  }
  // const selectMembers = React.useMemo(
  //   () => fetchAdminOnly(),
  //   [workspace_id, fetchAdminOnly]
  // );
  useEffect(() => {
    fetchAdminOnly()
  }, [])
  // const users = useSelector(selectMembers);
  // console.log('user is coming in this', users);


  // const handleIndividualMessage = async (u) => {
  //   const token = u?.user_id.slice(0, 6) + `${session?.user?.id.slice(0, 6)}`;
  //   navigate(`/workspace/${workspace_id}/individual/${token}`);
  //   const res = {
  //     sender_id: session?.user?.id,
  //     receiver_id: u?.user_id,
  //     token,
  //   };
  //   dispatch(newDirect(u?.user_profiles?.full_name));
  //   const { error } = await postToSupabase("directMessagesChannel", res);
  //   if (error) console.log(error);
  // };
  return (
    <>
      <AddChannelDialog
        open={addChannelOpen}
        onOpenChange={setAddChannelOpen}
        usedIn={"createChannel"}
      />
      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} />
      <SidebarContent className="h-full bg-(--sidebar) text-(--foreground) border-2 border-(--sidebar-border) px-2 py-4 flex flex-col gap-4">
        <SideBarHeader session={session} />
        <div className='flex flex-col gap-2 border-y-2 w-full border-(--sidebar-border)'>
          <SideBarChannels setAddChannelOpen={setAddChannelOpen}
            session={session} workspace_id={workspace_id} groupId={groupId} />
          <SideBarApps workspace_id={workspace_id} />
        </div>
        <SideBarFooter session={session} setInviteOpen={setInviteOpen} handleLogout={handleLogout} />
      </SidebarContent >
    </>
  );
};

export default Sidebar;
