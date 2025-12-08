import React from "react";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { Users } from "lucide-react";

const ChannelItem = React.memo(({ channel, isActive, onClick }) => {
  console.log(`ChannelItem ${channel.id} rendered`);
  
  return (
    <SidebarMenuItem>
      <div
        onClick={() => onClick(channel)}
        className={`flex items-center gap-2 rounded px-2 py-1 cursor-pointer ${
          isActive 
            ? "bg-(--sidebar-accent) text-white" 
            : "hover:bg-(--sidebar-accent)"
        }`}
      >
        <Users className="w-4 h-4" />
        <span className="text-[15px]">{channel.channel_name}</span>
      </div>
    </SidebarMenuItem>
  );
});

ChannelItem.displayName = "ChannelItem";

export default ChannelItem;