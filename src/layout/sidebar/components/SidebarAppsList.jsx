import React from "react";
import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { Calendar, Telescope } from "lucide-react";

const SidebarAppsList = ({ workspace_id }) => {
  const navigate = useNavigate();
  return (
    <SidebarMenu>
      <SidebarGroupLabel className="text-(--sidebar-foreground) font-normal text-sm py-1">
        Apps
      </SidebarGroupLabel>

      <div className="flex flex-col gap-0">
        <SidebarMenuItem>
          <div
            className="flex items-center gap-2 px-2 py-1 cursor-pointer 
                       hover:bg-(--sidebar-accent) font-medium text-sm"
            onClick={() => navigate(`/workspace/${workspace_id}/market`)}
          >
            <span className="bg-(--standard)/10 h-7 w-5 rounded-md flex items-center justify-center">
              <Telescope className="w-4 h-4 text-(--sidebar-foreground)" />
            </span>
            <span className="text-[15px]">Market Insight</span>
          </div>
        </SidebarMenuItem>

        <SidebarMenuItem>
          <div
            className="flex items-center gap-2 px-2 py-1 cursor-pointer 
                       hover:bg-(--sidebar-accent) font-medium"
            onClick={() => navigate(`/workspace/${workspace_id}/calendar`)}
          >
            <span className="bg-(--standard)/10 h-7 w-5 rounded-md flex items-center justify-center">
              <Calendar className="w-4 h-4 text-(--sidebar-foreground)" />
            </span>
            <span className="text-[15px]">Economic Calendar</span>
          </div>
        </SidebarMenuItem>
      </div>
    </SidebarMenu>
  );
};

export default React.memo(SidebarAppsList);
