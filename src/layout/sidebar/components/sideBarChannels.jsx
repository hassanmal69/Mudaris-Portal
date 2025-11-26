import React, { useEffect, useState } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useDispatch, useSelector } from "react-redux";
import {
  selectActiveChannel,
  setActiveChannel,
} from "@/redux/features/channels/channelsSlice";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import { Megaphone, Link as Chain, Video } from "lucide-react";
import { fetchChannelMembersbyUser } from "@/redux/features/channelMembers/channelMembersSlice";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "@heroicons/react/24/outline";
import { Users } from "lucide-react";
import { isAdmin } from "@/constants/constants";
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
      <SidebarGroupLabel className="text-(--sidebar-foreground) font-normal text-sm">
        Channels
      </SidebarGroupLabel>
      <SidebarMenu>
        {visibleChannel.map((cm) => {
          const channel = cm.channels;
          const isActive = activeChannel?.id === channel.id;
          return (
            <SidebarMenuItem key={channel.id}>
              <div
                onClick={() => handleChannelClick(channel)}
                className={`flex items-center gap-2 rounded px-2 py-1  cursor-pointer 
                      ${
                        isActive
                          ? "bg-(--sidebar-accent) text-white"
                          : "hover:bg-(--sidebar-accent)"
                      }`}
              >
                <Users className="w-4 h-4" />
                <span className="font-normal text-[15px]">
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
              <span className="font-normal text-[15px]">Announcements</span>
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

              <span className="font-normal text-[15px]">Lecture's Links</span>
            </div>
          </Link>
          <Link to={`/workspace/${workspace_id}/videospresentations`}>
            <div
              className={`flex items-center gap-2 px-2 py-1 cursor-pointer 
                      ${
                        activeChannel === "lecturesLink"
                          ? "bg-(--sidebar-accent) text-white"
                          : "hover:bg-(--sidebar-accent)"
                      }`}
            >
              <Video className="w-4 h-4" />

              <span className="font-normal text-sm">
                Videos & Presentations
              </span>
            </div>
          </Link>
        </SidebarMenuItem>

        {isAdmin && (
          <button
            className="flex items-center gap-2 w-full px-2 py-2 rounded hover:bg-(--sidebar-accent) text-(--sidebar-foreground)/70 hover:text-(--sidebar-foreground)"
            onClick={() => setAddChannelOpen(true)}
          >
            <PlusIcon className="w-4 h-4" />
            <p className="text-[15px]">Create Channel</p>
          </button>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default SideBarChannels;
