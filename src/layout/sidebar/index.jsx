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
  const fallbackColors = [
    "bg-rose-200",
    "bg-sky-200",
    "bg-emerald-200",
    "bg-amber-200",
    "bg-violet-200",
    "bg-fuchsia-200",
  ];
  const getUserFallback = (name, idx) => {
    // pick a color based on user id or index
    const color = fallbackColors[idx % fallbackColors.length];

    return (
      <Avatar className="w-7 h-7 border-2 border-white rounded-sm flex items-center justify-center">
        <AvatarFallback
          className={`text-[#2b092b]  text-sm rounded-none font-semibold ${color}`}
        >
          {name?.[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  };
  const getWorkspaceFallback = (name, idx) => {
    const color = fallbackColors[idx % fallbackColors.length];
    return (
      <Avatar
        className={`w-16 h-16 rounded-sm  flex items-center justify-center`}
      >
        <AvatarFallback
          className={`text-[#2b092b] ${color} rounded-none text-xl font-bold`}
        >
          {name?.[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  };
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
      <SidebarContent className="h-full bg-[#230423] text-[#EEEEEE] px-2 py-4 flex flex-col gap-4">
        <SidebarHeader className="flex gap-2">
          {currentWorkspace?.avatar_url ? (
            <Avatar className="w-16 h-16 rounded-none">
              <AvatarImage
                src={currentWorkspace?.avatar_url}
                alt={currentWorkspace?.workspace_name}
              />
              <AvatarFallback>
                {currentWorkspace.workspace_name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            getWorkspaceFallback(
              currentWorkspace?.workspace_name,
              currentWorkspace?.id[0]
            )
          )}

          <span className="text-lg font-bold tracking-tight">
            {loading
              ? "Loading..."
              : currentWorkspace?.workspace_name || "Workspace"}
          </span>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white font-medium text-[16px]">
            Channels
          </SidebarGroupLabel>
          <SidebarMenu>
            {channels.map((channel) => (
              <SidebarMenuItem key={channel.id}>
                <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#480c48] cursor-pointer">
                  {channel.visibility === "private" ? (
                    <LockClosedIcon className="w-4 h-4 " />
                  ) : (
                    <GlobeAltIcon className="w-4 h-4 " />
                  )}
                  <Link to={`/workspace/${workspace_id}/group/${channel.id}`}>
                    <span className="font-medium text-sm">
                      {channel.name || channel.channel_name}
                    </span>
                  </Link>
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          {session.user.user_metadata.user_role === "admin" ? (
            <Button
              size="sm"
              className="mt-2 bg-[#eee] text-[#2b092b] w-full flex items-center gap-2 justify-center hover:bg-transparent hover:text-white hover:border-[#fff] transition-all delay-150 duration-300 border"
              onClick={() => setAddChannelOpen(true)}
            >
              <PlusIcon className="w-4 h-4" />
              Add Channel
            </Button>
          ) : (
            ""
          )}
        </SidebarGroup>
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className="font-medium text-m text-[#EEEEEE]">
            Direct Messages
          </SidebarGroupLabel>
          <SidebarMenu>
            {users.map((user, id) => (
              <SidebarMenuItem key={user.user_id}>
                <div
                  onClick={() => handleIndividualMessage(user)}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-[#480c48] cursor-pointer"
                >
                  {user.user_profiles.avatar_url ? (
                    <Avatar className="w-7 h-7">
                      <AvatarImage
                        src={user.user_profiles.avatar_url}
                        alt={user.user_profiles.full_name}
                      />
                    </Avatar>
                  ) : (
                    getUserFallback(user.user_profiles.full_name, id)
                  )}

                  <span className="font-medium text-sm ">
                    {user.user_profiles.full_name}
                  </span>
                  <span
                    className={`ml-auto w-2 h-2 rounded-full ${
                      user.status === "online" ? "bg-green-500" : "bg-gray-400"
                    }`}
                    title={user.status}
                  ></span>
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarFooter className="mt-auto pb-2">
          {session.user.user_metadata.user_role === "admin" ? (
            <Button
              variant="default"
              size="sm"
              className="mt-2 bg-[#eee] text-[#2b092b] w-full flex items-center gap-2 justify-center hover:bg-transparent hover:text-white hover:border-[#fff] transition-all delay-150 duration-300 border"
              onClick={() => setInviteOpen(true)}
            >
              Invite new Users
            </Button>
          ) : (
            ""
          )}
        </SidebarFooter>
      </SidebarContent>
    </>
  );
};

export default Sidebar;
