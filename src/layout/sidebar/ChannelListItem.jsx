import React from "react";
import { SidebarMenuItem } from "@/components/ui/sidebar";
const ChannelListItem = React.memo(function ChannelListItem({
  channel,
  isActive,
  onClick,
}) {
  return (
    <SidebarMenuItem key={channel.id}>
      <div
        onClick={onClick}
        className={`flex items-center gap-2 px-2 py-1 cursor-pointer 
          ${isActive ? "bg-(--sidebar-accent) text-white" : "hover:bg-(--sidebar-accent)"}`}
      >
        # <span className="font-normal text-sm">{channel.channel_name}</span>
      </div>
    </SidebarMenuItem>
  );
});

export default ChannelListItem;
