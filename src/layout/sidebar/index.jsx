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
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { postToSupabase } from "@/utils/crud/posttoSupabase";
import { fetchWorkspaceById } from "@/features/workspace/workspaceSlice";
import {
  fetchWorkspaceMembers,
  selectWorkspaceMembers,
} from "@/features/workspaceMembers/WorkspaceMembersSlice.js";
import { newDirect } from "@/features/channels/directSlice";
import { fetchChannelMembersbyUser } from "@/features/channelMembers/channelMembersSlice";
import { supabase } from "@/services/supabaseClient";
import {
  selectActiveChannel,
  setActiveChannel,
} from "@/features/channels/channelsSlice";
import { logOut } from "@/features/auth/authSlice.js";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { session } = useSelector((state) => state.auth);
  const [addChannelOpen, setAddChannelOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const { workspace_id, user_id, groupId } = useParams();
  const [visibleChannel, setVisibleChannel] = useState([]);
  const activeChannel = useSelector(selectActiveChannel);

  const { currentWorkspace, loading } = useSelector(
    (state) => state.workSpaces
  );
  const getUserFallback = (name, idx) => {
    // pick a color based on user id or index
    const color = fallbackColors[idx % fallbackColors.length];
    return (
      <Avatar className="w-7 h-7 border-2 border-white rounded-sm flex items-center justify-center">
        <AvatarFallback
          className={`text-[#2b092b] text-sm rounded-none font-semibold ${color}`}
        >
          {name?.[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  };
  const channelFind = async () => {
    const returnedChannels = await dispatch(
      fetchChannelMembersbyUser(session?.user?.id)
    );
    const filtered = returnedChannels?.payload?.channel?.filter(
      (cm) => cm.channels.workspace_id === workspace_id
    );
    setVisibleChannel(filtered || []);
  };
  const handleLogout = () => {
    dispatch(logOut());
  };
  useEffect(() => {
    if (session?.user?.id) {
      channelFind();
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (!session?.user?.id) return;

    channelFind(); // initial fetch

    const subscription = supabase
      .channel("realtime:channel_members")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "channel_members",
          filter: `user_id=eq.${session.user.id}`,
        },
        () => {
          channelFind(); // refresh on any insert/update/delete
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [session?.user?.id, workspace_id]);

  useEffect(() => {
    if (workspace_id) {
      dispatch(fetchWorkspaceById(workspace_id));
      dispatch(fetchWorkspaceMembers(workspace_id));
    }
  }, [workspace_id, dispatch]);

  const selectMembers = React.useMemo(
    () => selectWorkspaceMembers(workspace_id),
    [workspace_id]
  );

  const users = useSelector(selectMembers);

  useEffect(() => {
    if (!groupId && !session.user.id && visibleChannel.length > 0) {
      const channelId = visibleChannel[0].channels.id;
      if (channelId) {
        navigate(`/workspace/${workspace_id}/group/${channelId}`);
        dispatch(setActiveChannel(channelId)); // auto set first active channel
      }
    }
  }, [visibleChannel, workspace_id]);

  const handleChannelClick = (channel) => {
    dispatch(setActiveChannel(channel.id));
    navigate(`/workspace/${workspace_id}/group/${channel.id}`);
  };

  const fallbackColors = [
    "bg-rose-200",
    "bg-sky-200",
    "bg-emerald-200",
    "bg-amber-200",
    "bg-violet-200",
    "bg-fuchsia-200",
  ];
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

  const handleIndividualMessage = async (u) => {
    const token = u?.user_id.slice(0, 6) + `${session?.user?.id.slice(0, 6)}`;
    navigate(`/workspace/${workspace_id}/individual/${token}`);
    const res = {
      sender_id: session?.user?.id,
      receiver_id: u?.user_id,
      token,
    };
    dispatch(newDirect(u?.user_profiles?.full_name));
    const { error } = await postToSupabase("directMessagesChannel", res);
    if (error) console.log(error);
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
          <Link to={`/dashboard/${session?.user?.id}`}>
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
          </Link>

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
            {visibleChannel.map((cm) => {
              const channel = cm.channels;
              const isActive = activeChannel?.id === channel.id;
              console.log("cm opubnk", cm);
              return (
                <SidebarMenuItem key={channel.id}>
                  <div
                    onClick={() => handleChannelClick(channel)}
                    className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer 
                      ${
                        isActive
                          ? "bg-[#480c48] text-white"
                          : "hover:bg-[#480c48]"
                      }`}
                  >
                    {channel.visibility === "private" ? (
                      <LockClosedIcon className="w-4 h-4 " />
                    ) : (
                      <GlobeAltIcon className="w-4 h-4 " />
                    )}
                    <span className="font-medium text-sm">
                      {channel.channel_name}
                    </span>
                  </div>
                </SidebarMenuItem>
              );
            })}
            {session.user.user_metadata.user_role === "admin" && (
              <Button
                size="sm"
                className="mt-2 p-0 mx-1 my-0 w-[50%] bg-transparent cursor-pointer text-gray-400 text-[14px] flex items-center gap-2 justify-center hover:bg-transparent hover:text-white hover:border-[#fff] transition-all delay-150 duration-300 border-none"
                onClick={() => setAddChannelOpen(true)}
              >
                <PlusIcon className="w-4 h-4 bg-black/40 rounded text-gray-500" />
                Add Channel
              </Button>
            )}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarFooter className="mt-auto pb-2">
          {session.user.user_metadata.user_role === "admin" && (
            <Button
              variant="default"
              size="sm"
              className="mt-2 bg-[#eee] text-[#2b092b] w-full flex items-center gap-2 justify-center hover:bg-transparent hover:text-white hover:border-[#fff] transition-all delay-150 duration-300 border"
              onClick={() => setInviteOpen(true)}
            >
              Invite new Users
            </Button>
          )}
        </SidebarFooter>
        <button className="text-[#556cd6]" onClick={handleLogout}>
          Sign Out
        </button>
      </SidebarContent>
    </>
  );
};

export default Sidebar;
