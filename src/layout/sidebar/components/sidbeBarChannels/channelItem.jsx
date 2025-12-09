import React, { useEffect, useMemo } from "react";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import useUnread from "@/hooks/unread-hook/useUnread";

const ChannelItem = React.memo(({ channel, isActive, onClick }) => {
  const { getUnread } = useUnread();

  // Get unread count for this channel
  const unreadCount = useMemo(() =>
    getUnread(channel.id),
    [getUnread, channel.id]
  );
  const hasUnread = unreadCount > 0;

  return (
    <SidebarMenuItem>
      <div
        onClick={() => onClick(channel)}
        className={`flex items-center justify-between gap-2 rounded px-2 py-1 cursor-pointer ${isActive
          ? "bg-(--sidebar-accent) text-white"
          : "hover:bg-(--sidebar-accent)"
          }`}
      >
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="text-[15px]">{channel.channel_name}</span>
        </div>

        {hasUnread && (
          <Badge
            variant={isActive ? "secondary" : "destructive"}
            className="ml-auto"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </div>
    </SidebarMenuItem>
  );
});
export default ChannelItem