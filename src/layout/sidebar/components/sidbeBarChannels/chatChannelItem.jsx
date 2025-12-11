import React from "react";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { Users } from "lucide-react";

const ChatChannelItem = React.memo(({ channel, isActive, onClick }) => {
  console.log("ChatChannelItem rendered");
  console.log(channel)
  return (
    <SidebarMenuItem>
      <div
        onClick={() => onClick(channel)}
        className={`flex items-center gap-2 rounded px-2 py-1 cursor-pointer ${isActive
            ? "bg-(--sidebar-accent) text-white"
            : "hover:bg-(--sidebar-accent)"
          }`}
      >
        <Users className="w-4 h-4" />
        <span className="text-[15px]">Chat</span>
        <span>{channel.unreadCount !== undefined ? channel.unreadCount : "..."}</span>

      </div>
    </SidebarMenuItem>
  );
});

ChatChannelItem.displayName = "ChatChannelItem";

export default ChatChannelItem;