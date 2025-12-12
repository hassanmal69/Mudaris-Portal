import React from "react";
import ChannelItem from "./channelItem.jsx";

const ChannelsList = React.memo(({ 
  channels, 
  activeChannelId, 
  specialRoute, 
  onChannelClick 
}) => {
  console.log(`ChannelsList rendered with ${channels.length} channels`);
  
  return (
    <>
      {channels.map((channel) => (
        <ChannelItem
          key={channel.id}
          channel={channel}
          isActive={!specialRoute && activeChannelId === channel.id}
          onClick={onChannelClick}
        />
      ))}
    </>
  );
});

ChannelsList.displayName = "ChannelsList";

export default ChannelsList;
