import React, { useEffect, useMemo, useCallback, useRef } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  selectActiveChannel,
  setActiveChannel,
} from "@/redux/features/channels/channelsSlice";
import { useNavigate } from "react-router-dom";
import {
  fetchChannelMembersbyUser,
  selectChannelsByUser,
} from "@/redux/features/channelMembers/channelMembersSlice";
import ChannelsSection from "./channelSection";

// Main component
const SideBarChannels = ({ userId,workspace_id, setAddChannelOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Memoize selector
  let channelsSelector
  if (workspace_id) {
    channelsSelector = selectChannelsByUser(userId, workspace_id)
  }

  // Select data
  const visibleChannels = useSelector(channelsSelector, shallowEqual);
  const activeChannel = useSelector(selectActiveChannel);

  // Fetch channels once
  const fetchedUsers = useRef({});

  useEffect(() => {
    if (userId && !fetchedUsers.current[userId]) {
      dispatch(fetchChannelMembersbyUser(userId));
      fetchedUsers.current[userId] = true;
    }
  }, []);

  // Optimize chat/other channels separation
  const { chatChannel, otherChannels } = useMemo(() => {

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
      dispatch(setActiveChannel(channel.id));
      navigate(`/workspace/${workspace_id}/group/${channel.id}`);
    },
    [dispatch, navigate, workspace_id]
  );
  return (
    <ChannelsSection
      chatChannel={chatChannel}
      otherChannels={otherChannels}
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
