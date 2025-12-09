import React, { useEffect, useMemo, useCallback, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  selectActiveChannel,
  setActiveChannel,
} from "@/redux/features/channels/channelsSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { useIsAdmin } from "@/constants/constants.js";
import {
  fetchChannelMembersbyUser,
  selectChannelsByUser,
} from "@/redux/features/channelMembers/channelMembersSlice";
import ChannelsSection from "./channelSection";
import LoadingState from "./";

// Main component
const SideBarChannels = ({ userId, workspace_id, setAddChannelOpen }) => {
  const renderCount = useRef(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Track renders
  renderCount.current++;
  console.log("🔄 SideBarChannels MAIN rendered #", renderCount.current);

  // Memoize selector
  const channelsSelector = useMemo(
    () => selectChannelsByUser(userId, workspace_id),
    [userId, workspace_id]
  );

  // Select data
  const visibleChannels = useSelector(channelsSelector, shallowEqual);
  const activeChannel = useSelector(selectActiveChannel);

  // Fetch channels once
  useEffect(() => {
    console.log("Fetch effect running for userId:", userId);
    if (userId) {
      dispatch(fetchChannelMembersbyUser(userId));
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

  // Optimize chat/other channels separation
  const { chatChannel, otherChannels } = useMemo(() => {
    console.log("Processing channels:", visibleChannels.length);

    let chat = null;
    const others = [];

    for (const channel of visibleChannels) {
      if (channel.channel_name === "Chat") {
        chat = channel;
      } else {
        others.push(channel);
      }
    }

    return { chatChannel: chat, otherChannels: others };
  }, [visibleChannels]);

  // Click handler
  const handleChannelClick = useCallback(
    (channel) => {
      console.log("Channel clicked:", channel.id);
      dispatch(setActiveChannel(channel.id));
      navigate(`/workspace/${workspace_id}/group/${channel.id}`);
    },
    [dispatch, navigate, workspace_id]
  );

  // Loading state
  // if (!visibleChannels?.length) {
  //   return <LoadingState />;
  // }

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

// Add debugging
SideBarChannels.whyDidYouRender = true;

// Export with React.memo
export default React.memo(SideBarChannels, (prevProps, nextProps) => {
  const isEqual =
    prevProps.userId === nextProps.userId &&
    prevProps.workspace_id === nextProps.workspace_id &&
    prevProps.setAddChannelOpen === nextProps.setAddChannelOpen;

  console.log("SideBarChannels props comparison:", {
    prevProps,
    nextProps,
    isEqual,
  });

  return isEqual;
});
