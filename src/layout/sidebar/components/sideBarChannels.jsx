import React, { useEffect, useMemo, useRef } from "react";
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
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import { Megaphone, Link as Chain, Video, Users } from "lucide-react";
import { fetchChannelMembersbyUser } from "@/redux/features/channelMembers/channelMembersSlice";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useIsAdmin } from "@/constants/constants.js";

const SideBarChannels = ({
  session,
  workspace_id,
  groupId,
  setAddChannelOpen,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = useIsAdmin();
  const channelRef = useRef(null);
  console.log(isAdmin, "sidebar log");
  const currentURL = location.pathname;

  // --- Recognize special URL routes ---
  const specialRoute = useMemo(() => {
    const map = [
      { key: "announcements", match: "announcement" },
      { key: "lecturesLink", match: "lecturesLink" },
      { key: "videospresentations", match: "videospresentations" },
    ];
    const found = map.find((r) => currentURL.includes(r.match));
    return found?.key || "";
  }, [currentURL]);
  const userId = session?.user?.id;

  const channelMembersEntry = useSelector(
    (state) => state.channelMembers.byChannelId[userId] || { data: [] }
  );

  const channelMembers = channelMembersEntry.data || [];

  // Filter channels in this workspace
  const visibleChannels = useMemo(() => {
    return channelMembers.filter(
      (cm) => cm?.channels?.workspace_id === workspace_id
    );
  }, [channelMembers, workspace_id]);

  const gotChat = (channels) => {
    if (!Array.isArray(channels) || channels.length === 0) return null;
    return visibleChannels.find((m) => m.channels.channel_name === "Chat")
      ?.channels;
  };
  const getOtherChannels = (channels) => {
    if (!Array.isArray(channels) || channels.length === 0) return null;
    return channels
      .filter((m) => m.channels.channel_name !== "Chat")
      .map((m) => m.channels);
  };
  const chatChannel = gotChat(visibleChannels);
  const otherChannels = getOtherChannels(visibleChannels);

  console.log("visible c ->", visibleChannels);
  const activeChannel = useSelector(selectActiveChannel);

  // Fetch on mount
  useEffect(() => {
    if (!userId) return;
    if (!channelMembersEntry.data?.length) {
      dispatch(fetchChannelMembersbyUser(userId));
    }
  }, [userId]);

  // Realtime updates
  useEffect(() => {
    if (!userId) return;

    const ch = supabase
      .channel(`channel_members_user_${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "channel_members",
          filter: `user_id=eq.${userId}`,
        },
        () => {
          dispatch(fetchChannelMembersbyUser(userId));
        }
      )
      .subscribe();

    channelRef.current = ch;

    return () => {
      supabase.removeChannel(ch);
    };
  }, [userId]);

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
        {/* 1️⃣ CHAT CHANNEL FIRST */}
        {chatChannel && (
          <SidebarMenuItem>
            <div
              onClick={() => handleChannelClick(chatChannel)}
              className={`flex items-center gap-2 rounded px-2 py-1 cursor-pointer 
              ${
                activeChannel?.id === chatChannel.id && !specialRoute
                  ? "bg-(--sidebar-accent) text-white"
                  : "hover:bg-(--sidebar-accent)"
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="text-[15px]">Chat</span>
            </div>
          </SidebarMenuItem>
        )}

        {/* 2️⃣ STATIC SECTIONS */}
        <SidebarMenuItem>
          <Link to={`/workspace/${workspace_id}/announcements`}>
            <div
              className={`flex items-center gap-2 px-2 py-1 cursor-pointer ${
                specialRoute === "announcements"
                  ? "bg-(--sidebar-accent) text-white"
                  : "hover:bg-(--sidebar-accent)"
              }`}
            >
              <Megaphone className="w-4 h-4" />
              <span className="text-[15px]">Announcements</span>
            </div>
          </Link>

          <Link to={`/workspace/${workspace_id}/lecturesLink`}>
            <div
              className={`flex items-center gap-2 px-2 py-1 cursor-pointer ${
                specialRoute === "lecturesLink"
                  ? "bg-(--sidebar-accent) text-white"
                  : "hover:bg-(--sidebar-accent)"
              }`}
            >
              <Chain className="w-4 h-4" />
              <span className="text-[15px]">Lecture's Links</span>
            </div>
          </Link>

          <Link to={`/workspace/${workspace_id}/videospresentations`}>
            <div
              className={`flex items-center gap-2 px-2 py-1 cursor-pointer ${
                specialRoute === "videospresentations"
                  ? "bg-(--sidebar-accent) text-white"
                  : "hover:bg-(--sidebar-accent)"
              }`}
            >
              <Video className="w-4 h-4" />
              <span className="text-sm">Videos & Presentations</span>
            </div>
          </Link>
        </SidebarMenuItem>

        {/* 3️⃣ OTHER CHANNELS */}
        {otherChannels && otherChannels.length > 0 && (
          <div>
            {otherChannels.map((channel) => {
              let isActive = activeChannel?.id === channel.id;

              if (specialRoute) {
                isActive = false;
              }

              return (
                <SidebarMenuItem key={channel.id}>
                  <div
                    onClick={() => handleChannelClick(channel)}
                    className={`flex items-center gap-2 rounded px-2 py-1 cursor-pointer 
              ${
                isActive
                  ? "bg-(--sidebar-accent) text-white"
                  : "hover:bg-(--sidebar-accent)"
              }`}
                  >
                    <Users className="w-4 h-4" />
                    <span className="text-[15px]">{channel.channel_name}</span>
                  </div>
                </SidebarMenuItem>
              );
            })}
          </div>
        )}

        {/* ADMIN: CREATE CHANNEL */}
        {isAdmin && (
          <button
            className="flex items-center gap-2 w-full px-2 py-2 rounded hover:bg-(--sidebar-accent)"
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

export default React.memo(SideBarChannels);
