// SideBarChannels.jsx - SIMPLIFIED VERSION
import React, { useEffect, useMemo, useCallback, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  selectActiveChannel,
  setActiveChannel,
} from "@/redux/features/channels/channelsSlice";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchChannelMembersbyUser,
  selectChannelsByUser,
} from "@/redux/features/channelMembers/channelMembersSlice";
import ChannelsSection from "./channelSection";

// Main component
const SideBarChannels = ({ userId, workspace_id, setAddChannelOpen }) => {
  const renderCount = useRef(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // 🔥 JUST CALL THE HOOK - don't destructure getUnread

  // Track renders
  renderCount.current++;
  if (renderCount.current > 3) {
    console.log("🚨 SideBarChannels is rendering too much!", renderCount.current);
  }

  // Memoize selector
  const channelsSelector = useMemo(
    () => selectChannelsByUser(userId, workspace_id),
    [userId, workspace_id]
  );

  // 🔥 This now gets channels WITH unreadCounts already attached
  const channelsWithUnread = useSelector(channelsSelector, shallowEqual);
  const activeChannel = useSelector(selectActiveChannel, shallowEqual);
  console.log('check channels',channelsWithUnread)
  // Fetch channels once - use a ref to track if already fetched
  const hasFetched = useRef(false);
  useEffect(() => {
    if (userId && !hasFetched.current) {
      console.log("Fetch effect running for userId:", userId);
      dispatch(fetchChannelMembersbyUser(userId));
      hasFetched.current = true;
    }
  }, [dispatch, userId]);

  // Optimize special route detection
  const specialRoute = useMemo(() => {
    const path = location.pathname;
    if (path.includes("announcement")) return "announcements";
    if (path.includes("lecturesLink")) return "lecturesLink";
    if (path.includes("videospresentations")) return "videospresentations";
    return "";
  }, [location.pathname]);
  // 🔥 SIMPLIFIED: Channels already have unreadCount from selector
  const { chatChannel, otherChannels } = useMemo(() => {
    let chat = null;
    const others = [];

    for (const channel of channelsWithUnread) {
      if (channel.channel_name === "Chat") {
        chat = channel;
      } else {
        others.push(channel);
      }
    }

    return { chatChannel: chat, otherChannels: others };
  }, [channelsWithUnread]); // Single dependency!

  // Click handler
  const handleChannelClick = useCallback(
    (channel) => {
      console.log("Channel clicked:", channel.id);
      dispatch(setActiveChannel(channel.id));
      navigate(`/workspace/${workspace_id}/group/${channel.id}`);
    },
    [dispatch, navigate, workspace_id]
  );

  // Debug

  return (
    <ChannelsSection
      chatChannel={chatChannel}
      otherChannels={otherChannels}
      specialRoute={specialRoute}
      activeChannelId={activeChannel?.id}
      setAddChannelOpen={setAddChannelOpen}
      onChannelClick={handleChannelClick}
    />
  );
};

// 🔥 Add custom comparison to prevent unnecessary re-renders
export default React.memo(SideBarChannels, (prevProps, nextProps) => {
  return (
    prevProps.userId === nextProps.userId &&
    prevProps.workspace_id === nextProps.workspace_id &&
    prevProps.setAddChannelOpen === nextProps.setAddChannelOpen
  );
});