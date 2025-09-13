import React, { useEffect, useState } from "react";
import AddChannelDialog from "@/components/add-channel-dialog";
import InviteDialog from "@/components/invite-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  LockClosedIcon,
  GlobeAltIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useParams } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { postToSupabase } from "@/utils/crud/posttoSupabase";
import { fetchWorkspaceById } from "@/features/workspace/workspaceSlice";
import {
  fetchWorkspaceMembers,
  selectWorkspaceMembers,
} from "@/features/workspaceMembers/WorkspaceMembersSlice.js";
import {
  fetchChannels,
  subscribeToChannelChanges,
  unsubscribeFromChannelChanges,
} from "@/features/channels/channelsSlice.js";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { session } = useSelector((state) => state.auth);
  const [addChannelOpen, setAddChannelOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const { workspace_id } = useParams();
  const { user_id } = useParams();
  const { groupId } = useParams();

  const { currentWorkspace, loading } = useSelector(
    (state) => state.workSpaces
  );

  const channelState = useSelector((state) => state.channels);
  const channels = channelState.allIds.map((id) => ({
    id,
    name: channelState.byId[id]?.channel_name,
    visibility: channelState.byId[id]?.visibility,
  }));

  useEffect(() => {
    if (workspace_id) {
      dispatch(fetchWorkspaceById(workspace_id));
    }
  }, [workspace_id, dispatch]);

  useEffect(() => {
    if (workspace_id) {
      dispatch(fetchChannels(workspace_id));
      subscribeToChannelChanges();
      return () => {
        unsubscribeFromChannelChanges();
      };
    }
  }, [workspace_id, dispatch]);

  useEffect(() => {
    if (workspace_id) {
      dispatch(fetchWorkspaceMembers(workspace_id));
    }
  }, [workspace_id, dispatch]);

  const users = useSelector(selectWorkspaceMembers(workspace_id));

  useEffect(() => {
    if (!groupId && !user_id && channels.length > 0) {
      const channelId = channels[0].id;
      navigate(`/workspace/${workspace_id}/group/${channelId}`);
    }
  }, [channels, groupId, navigate, workspace_id]);

  const handleIndividualMessage = async (u) => {
    const token = u?.user_id.slice(0, 6) + session?.user?.id.slice(0, 6);
    console.log(token);
    navigate(`/workspace/${workspace_id}/individual/${token}`);
    const res = {
      sender_id: session?.user?.id,
      receiver_id: u?.user_id,
      token,
    };
    const { data, error } = await postToSupabase("directMessagesChannel", res);
    if (error) console.log(error);
    console.log(data);
  };

  return (
    <>
      <AddChannelDialog
        open={addChannelOpen}
        onOpenChange={setAddChannelOpen}
        usedIn={"createChannel"}
      />
      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} />
      <SidebarContent className="h-full bg-[#222831] text-[#EEEEEE] px-2 py-4 flex flex-col gap-4">
        <SidebarHeader>
          <span className="text-lg font-bold tracking-tight">
            {loading
              ? "Loading..."
              : currentWorkspace?.workspace_name || "Workspace"}
          </span>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>Channels</SidebarGroupLabel>
          <SidebarMenu>
            {channels.map((channel) => (
              <SidebarMenuItem key={channel.id}>
                <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer">
                  {channel.visibility === "private" ? (
                    <LockClosedIcon className="w-4 h-4 " />
                  ) : (
                    <GlobeAltIcon className="w-4 h-4 " />
                  )}
                  <Link to={`/workspace/${workspace_id}/group/${channel.id}`}>
                    <span className="font-medium text-sm">
                      {channel.name || channel.channel_name}
                    </span>
                    <span className="font-medium text-sm text-gray-800">
                      {channel.name}
                    </span>
                  </Link>
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          {
            session.user.user_metadata.user_role === 'admin' ?
              < Button
                variant="outline"
                size="sm"
                className="mt-2 bg-[#00ADB5] text-[#222831] w-full flex items-center gap-2 justify-center"
                onClick={() => setAddChannelOpen(true)}
              >
                <PlusIcon className="w-4 h-4" />
                Add Channel
              </Button>
              :
              ""
          }
        </SidebarGroup>
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="font-medium text-m text-[#EEEEEE]">
            Direct Messages
          </SidebarGroupLabel>
          <SidebarMenu>
            {users.map((user) => (
              <SidebarMenuItem key={user.user_id}>
                <div
                  onClick={() => handleIndividualMessage(user)}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
                >
                  <Avatar className="w-7 h-7">
                    <AvatarImage
                      src={user.user_profiles.avatar_url}
                      alt={user.user_profiles.full_name}
                    />
                  </Avatar>
                  <span className="font-medium text-sm ">
                    {user.user_profiles.full_name}
                  </span>
                  <span
                    className={`ml-auto w-2 h-2 rounded-full ${user.status === "online" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    title={user.status}
                  ></span>
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarFooter className="mt-auto pb-2">
  {
    session.user.user_metadata.user_role === 'admin' ?
      <Button
        variant="default"
        size="sm"
        className="w-full bg-[#00ADB5] text-[#222831]"
        onClick={() => setInviteOpen(true)}
      >
        Invite new Users

      </Button>
      :
      ""
  }
        </SidebarFooter >
      </SidebarContent >
    </>
  );
};

export default Sidebar;
