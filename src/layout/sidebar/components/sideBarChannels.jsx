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
import {
  Megaphone,
  Link as Chain,
  Video,
  MessageSquareLock,
  Users,
} from "lucide-react";
import { fetchChannelMembersbyUser } from "@/redux/features/channelMembers/channelMembersSlice";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useIsAdmin } from "@/constants/constants.js";

const SideBarChannels = ({ session, workspace_id, groupId, setAddChannelOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentURL = location.pathname;
  const isAdmin = useIsAdmin();
  const channelRef = useRef(null);

  // --- derive specialRoute from URL (unchanged) ---
  const specialRoute = useMemo(() => {
    const map = [
      { key: "announcements", match: "announcement" },
      { key: "lecturesLink", match: "lecturesLink" },
      { key: "videospresentations", match: "videospresentations" },
    ];
    const found = map.find((r) => currentURL.includes(r.match));
    return found?.key || "";
  }, [currentURL]);

  // --- select channel members from Redux (by user id) ---
  const userId = session?.user?.id;
  const channelMembersEntry = useSelector(
    (state) => state.channelMembers.byChannelId[userId] || { data: [], status: "idle" }
  );
  const channelMembers = channelMembersEntry.data || [];

  let visibleChannels = useMemo(
    () =>
      Array.isArray(channelMembers)
        ? channelMembers.filter((cm) => cm?.channels?.workspace_id === workspace_id)
        : [],
    [channelMembers, workspace_id]
  );

  const activeChannel = useSelector(selectActiveChannel);

  useEffect(() => {
    if (!userId) return;
    if (!channelMembersEntry.data?.length && channelMembersEntry.status !== "loading") {
      dispatch(fetchChannelMembersbyUser(userId));
    }
  }, [userId, channelMembersEntry.data?.length, channelMembersEntry.status, dispatch]);

useEffect(() => {
  if (!userId) return;

  const channel = supabase
    .channel(`channel_members_user_${userId}`)
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "channel_members",
        filter: `user_id=eq.${userId}`,
      },
      (payload) => {
        console.log("🔥 Realtime event detected:", payload);
        dispatch(fetchChannelMembersbyUser(userId));
      }
    )
    .subscribe((status) => {
      console.log("📡 Realtime status:", status);
    });
    channelRef.current = channel;

  return () => {
    supabase.removeChannel(channel);
  };
}, [userId, dispatch]);

  // --- auto-select / navigate to first channel if none selected ---
  useEffect(() => {
    if (!groupId && userId && visibleChannels.length > 0) {
      const firstChannelId = visibleChannels[0]?.channels?.id;
      // Only auto-navigate if we have a channel and there's no active channel already
      if (firstChannelId && (!activeChannel || !activeChannel.id)) {
        dispatch(setActiveChannel(firstChannelId));
        navigate(`/workspace/${workspace_id}/group/${firstChannelId}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visibleChannels, workspace_id, groupId, userId]); // keep deps minimal and stable

  const handleChannelClick = (channel) => {
    if (!channel?.id) return;
    dispatch(setActiveChannel(channel.id));
    navigate(`/workspace/${workspace_id}/group/${channel.id}`);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-(--sidebar-foreground) font-normal text-sm">
        Channels
      </SidebarGroupLabel>

      <SidebarMenu>
        {visibleChannels.map((cm) => {
          const channel = cm.channels;
          if (!channel) return null;
          const isActive = activeChannel?.id === channel.id;

          return (
            <SidebarMenuItem key={channel.id}>
              <div
                onClick={() => handleChannelClick(channel)}
                className={`flex items-center gap-2 rounded px-2 py-1 cursor-pointer ${isActive ? "bg-(--sidebar-accent) text-white" : "hover:bg-(--sidebar-accent)"
                  }`}
              >
                {channel.visibility === "public" ? (
                  <Users className="w-4 h-4" />
                ) : (
                  <MessageSquareLock className="w-4 h-4" />
                )}
                <span className="font-normal text-[15px]">{channel.channel_name}</span>
              </div>
            </SidebarMenuItem>
          );
        })}

        {/* static links */}
        <SidebarMenuItem>
          <Link to={`/workspace/${workspace_id}/announcements`}>
            <div
              className={`flex items-center gap-2 px-2 py-1 cursor-pointer ${specialRoute === "announcements" ? "bg-(--sidebar-accent) text-white" : "hover:bg-(--sidebar-accent)"
                }`}
            >
              <Megaphone className="w-4 h-4" />
              <span className="font-normal text-[15px]">Announcements</span>
            </div>
          </Link>

          <Link to={`/workspace/${workspace_id}/lecturesLink`}>
            <div
              className={`flex items-center gap-2 px-2 py-1 cursor-pointer ${specialRoute === "lecturesLink" ? "bg-(--sidebar-accent) text-white" : "hover:bg-(--sidebar-accent)"
                }`}
            >
              <Chain className="w-4 h-4" />
              <span className="font-normal text-[15px]">Lecture's Links</span>
            </div>
          </Link>

          <Link to={`/workspace/${workspace_id}/videospresentations`}>
            <div
              className={`flex items-center gap-2 px-2 py-1 cursor-pointer ${specialRoute === "videospresentations" ? "bg-(--sidebar-accent) text-white" : "hover:bg-(--sidebar-accent)"
                }`}
            >
              <Video className="w-4 h-4" />
              <span className="font-normal text-sm">Videos & Presentations</span>
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

export default React.memo(SideBarChannels);
