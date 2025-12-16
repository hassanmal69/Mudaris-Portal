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
import { useLocation } from "react-router-dom";

const ChannelsSection = React.memo(
  ({
    chatChannel,
    otherChannels,
    activeChannelId,
    setAddChannelOpen,
    onChannelClick,
  }) => {
    const isAdmin = useIsAdmin();
    const location = useLocation();
    const specialRoute = useMemo(() => {
      const path = location.pathname;
      if (path.includes("announcement")) return "announcements";
      if (path.includes("lecturesLink")) return "lecturesLink";
      if (path.includes("videospresentations")) return "videospresentations";
      return "";
    }, [location.pathname]);

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
