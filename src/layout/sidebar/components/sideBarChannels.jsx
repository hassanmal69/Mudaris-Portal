import React, { useEffect, useState } from "react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveChannel,
  setActiveChannel,
} from "@/features/channels/channelsSlice";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import { fetchChannelMembersbyUser } from "@/features/channelMembers/channelMembersSlice";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Link as Chain, Megaphone } from "lucide-react";
const SideBarChannels = ({
  session,
  workspace_id,
  groupId,
  setAddChannelOpen,
}) => {
  const dispatch = useDispatch();
  const [visibleChannel, setVisibleChannel] = useState([]);
  const navigate = useNavigate();

  const activeChannel = useSelector(selectActiveChannel);
  const channelFind = async () => {
    const returnedChannels = await dispatch(
      fetchChannelMembersbyUser(session?.user?.id)
    );
    const filtered = returnedChannels?.payload?.channel?.filter(
      (cm) => cm.channels.workspace_id === workspace_id
    );
    setVisibleChannel(filtered || []);
  };
  useEffect(() => {
    if (session?.user?.id) {
      channelFind();
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (!session?.user?.id) return;

    channelFind();
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
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-(--sidebar-foreground) font-normal text-[16px]">
        Channels
      </SidebarGroupLabel>
      <SidebarMenu>
        {visibleChannel.map((cm) => {
          console.log("channels are", visibleChannel);
          const channel = cm.channels;
          const isActive = activeChannel?.id === channel.id;
          return (
            <SidebarMenuItem key={channel.id}>
              <div
                onClick={() => handleChannelClick(channel)}
                className={`flex items-center gap-2 px-2 py-1 cursor-pointer 
                      ${
                        isActive
                          ? "bg-(--sidebar-accent) text-white"
                          : "hover:bg-(--sidebar-accent)"
                      }`}
              >
                #
                <span className="font-normal text-sm">
                  {channel.channel_name}
                </span>
              </div>
            </SidebarMenuItem>
          );
        })}
        {/* temporary code */}
        <SidebarMenuItem>
          <Link to={`/workspace/${workspace_id}/announcements`}>
            <div
              className={`flex items-center gap-2 px-2 py-1 cursor-pointer 
                      ${
                        activeChannel === "announcements"
                          ? "bg-(--sidebar-accent) text-white"
                          : "hover:bg-(--sidebar-accent)"
                      }`}
            >
              <Megaphone className="w-4 h-4" />
              <span className="font-normal text-sm">Announcements</span>
            </div>
          </Link>
          <Link to={`/workspace/${workspace_id}/lecturesLink`}>
            <div
              className={`flex items-center gap-2 px-2 py-1 cursor-pointer 
                      ${
                        activeChannel === "lecturesLink"
                          ? "bg-(--sidebar-accent) text-white"
                          : "hover:bg-(--sidebar-accent)"
                      }`}
            >
              <Chain className="w-4 h-4" />

              <span className="font-normal text-sm">Lecture's Links</span>
            </div>
          </Link>
        </SidebarMenuItem>
        {session.user.user_metadata.user_role === "admin" && (
          <Button
            size="sm"
            className="mt-2 p-0 mx-1 my-0 w-[50%] bg-transparent cursor-pointer text-gray-400 text-[14px] flex items-center gap-2 justify-center hover:bg-transparent hover:text-white hover:border-[#fff] transition-all delay-150 duration-300 border-none"
            onClick={() => setAddChannelOpen(true)}
          >
            <PlusIcon className="w-4 h-4 bg-black/40 rounded text-gray-500" />
            Create Channel
          </Button>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SideBarChannels;
