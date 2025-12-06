import React, { useEffect, useMemo, useCallback, useRef } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useDispatch, useSelector } from "react-redux";
import { selectActiveChannel, setActiveChannel } from "@/redux/features/channels/channelsSlice";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Megaphone, Link as Chain, Video, Users } from "lucide-react";
import { PlusIcon } from "@heroicons/react/24/outline";
import { useIsAdmin } from "@/constants/constants.js";
import { fetchChannelMembersbyUser, selectChannelsByUser } from "@/redux/features/channelMembers/channelMembersSlice";

const SideBarChannels = ({ userId, workspace_id, setAddChannelOpen }) => {

  // --- RENDER COUNTER ---
  const renderCount = useRef(0);
  renderCount.current++;
  console.log("🔄 Sidebar RENDER CHANNEL #", renderCount.current);

  const prevProps = useRef({});
  useEffect(() => {
    const changes = [];

    const propMap = { userId, workspace_id, setAddChannelOpen };
    const prev = prevProps.current;

    Object.keys(propMap).forEach((key) => {
      if (prev[key] !== propMap[key]) {
        changes.push({
          prop: key,
          before: prev[key],
          after: propMap[key],
        });
      }
    });

    if (changes.length > 0) {
      console.log("⚡ Sidebar re-render triggered by PROP changes:", changes);
    }

    prevProps.current = propMap;
  });

  // Redux + navigation
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdmin = useIsAdmin();

  // Fetch channels once
  useEffect(() => {
    if (userId) dispatch(fetchChannelMembersbyUser(userId));
  }, []);

  // --- SELECTOR EXECUTION TRACKER ---
  const userChannels = useSelector((state) => {
    console.log("🎯 Selector RUN: selectChannelsByUser for userId =", userId);
    return selectChannelsByUser(userId)(state);
  });

  // Visible channels
  const visibleChannels = useMemo(
    () =>
      (userChannels || [])
        .map((c) => c.channels)
        .filter((c) => c.workspace_id === workspace_id),
    [userChannels, workspace_id]
  );

  // Special Route
  const specialRoute = useMemo(() => {
    const routes = [
      { key: "announcements", match: "announcement" },
      { key: "lecturesLink", match: "lecturesLink" },
      { key: "videospresentations", match: "videospresentations" },
    ];
    const found = routes.find((r) => location.pathname.includes(r.match));
    return found?.key || "";
  }, [location.pathname]);

  // Separate chat + others
  const chatChannel = useMemo(
    () => visibleChannels.find((c) => c.channel_name === "Chat") || null,
    [visibleChannels]
  );

  const otherChannels = useMemo(
    () => visibleChannels.filter((c) => c.channel_name !== "Chat"),
    [visibleChannels]
  );

  const activeChannel = useSelector(selectActiveChannel);

  // Channel click
  const handleChannelClick = useCallback(
    (channel) => {
      dispatch(setActiveChannel(channel.id));
      navigate(`/workspace/${workspace_id}/group/${channel.id}`);
    },
    [dispatch, navigate, workspace_id]
  );

  // Loading UI
  if (!userChannels?.length) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel className="text-(--sidebar-foreground) font-normal text-sm">
          Channels
        </SidebarGroupLabel>
        <SidebarMenu>
          <div className="px-2 py-1 text-sm text-gray-500">Loading channels...</div>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-(--sidebar-foreground) font-normal text-sm">
        Channels
      </SidebarGroupLabel>
      <SidebarMenu>
        {chatChannel && (
          <SidebarMenuItem>
            <div
              onClick={() => handleChannelClick(chatChannel)}
              className={`flex items-center gap-2 rounded px-2 py-1 cursor-pointer ${activeChannel?.id === chatChannel.id && !specialRoute
                  ? "bg-(--sidebar-accent) text-white"
                  : "hover:bg-(--sidebar-accent)"
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="text-[15px]">Chat</span>
            </div>
          </SidebarMenuItem>
        )}

        {["announcements", "lecturesLink", "videospresentations"].map((route) => {
          const routeMap = {
            announcements: { icon: Megaphone, label: "Announcements" },
            lecturesLink: { icon: Chain, label: "Lecture's Links" },
            videospresentations: { icon: Video, label: "Videos & Presentations" },
          };
          const { icon: Icon, label } = routeMap[route];
          return (
            <SidebarMenuItem key={route}>
              <Link to={`/workspace/${workspace_id}/${route}`}>
                <div
                  className={`flex items-center gap-2 px-2 py-1 cursor-pointer ${specialRoute === route
                      ? "bg-(--sidebar-accent) text-white"
                      : "hover:bg-(--sidebar-accent)"
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[15px]">{label}</span>
                </div>
              </Link>
            </SidebarMenuItem>
          );
        })}

        {otherChannels.map((channel) => {
          const isActive = !specialRoute && activeChannel?.id === channel.id;
          return (
            <SidebarMenuItem key={channel.id}>
              <div
                onClick={() => handleChannelClick(channel)}
                className={`flex items-center gap-2 rounded px-2 py-1 cursor-pointer ${isActive
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
