import React, { useState } from "react";
import AddChannelDialog from "@/components/Dialogs/add-channel-dialog";
import InviteDialog from "@/components/Dialogs/invite-dialog";
import { SidebarContent } from "@/components/ui/sidebar";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "@/redux/features/auth/authSlice.js";
import SideBarHeader from "./components/sideBarHeader";
import SideBarChannels from "./components/sideBarChannels";
import SideBarApps from "./components/sideBarApps";
import SideBarFooter from "./components/sideBarFooter";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { session } = useSelector((state) => state.auth);
  const [addChannelOpen, setAddChannelOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const { workspace_id, groupId } = useParams();
  const handleLogout = () => {
    dispatch(logOut());
  };
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
        <div className="flex flex-col gap-2 border-y-2 w-full border-(--sidebar-border)">
          <SideBarChannels
            setAddChannelOpen={setAddChannelOpen}
            session={session}
            workspace_id={workspace_id}
            groupId={groupId}
          />
          <SideBarApps workspace_id={workspace_id} />
        </div>
        <SideBarFooter
          session={session}
          setInviteOpen={setInviteOpen}
          handleLogout={handleLogout}
        />
      </SidebarContent>
    </>
  );
};

export default React.memo(Sidebar);
