import React, { useMemo } from "react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import ChatChannelItem from "./chatChannelItem";
import ChannelsList from "./channelList";
import SpecialRoutesList from "./specialRouteList";
import CreateChannelButton from "./chatChannelButton";
import { useIsAdmin } from "@/constants/constants";

const ChannelsSection = React.memo(
  ({
    chatChannel,
    otherChannels,
    specialRoute,
    activeChannelId,
    setAddChannelOpen,
    onChannelClick,
  }) => {
    console.log("ChannelsSection rendered");
    const isAdmin = useIsAdmin();

    return (
      <SidebarGroup>
        <SidebarGroupLabel className="text-(--sidebar-foreground) font-normal text-sm">
          Channels
        </SidebarGroupLabel>
        <SidebarMenu>
          {chatChannel && (
            <ChatChannelItem
              channel={chatChannel}
              isActive={!specialRoute && activeChannelId === chatChannel.id}
              onClick={onChannelClick}
            />
          )}

          <SpecialRoutesList specialRoute={specialRoute} />

          <ChannelsList
            channels={otherChannels}
            activeChannelId={activeChannelId}
            specialRoute={specialRoute}
            onChannelClick={onChannelClick}
          />

          {isAdmin && (
            <CreateChannelButton setAddChannelOpen={setAddChannelOpen} />
          )}
        </SidebarMenu>
      </SidebarGroup>
    );
  }
);

ChannelsSection.displayName = "ChannelsSection";

export default ChannelsSection;
