import React from "react";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { Megaphone, Link as Chain, Video } from "lucide-react";
const ROUTE_MAP = {
  announcements: {
    icon: <Megaphone className="w-4 h-4" />,
    label: "Announcements",
  },
  lecturesLink: {
    icon: <Chain className="w-4 h-4" />,
    label: "Lecture's Links",
  },
  videospresentations: {
    icon: <Video className="w-4 h-4" />,
    label: "Videos & Presentations",
  },
};

const SpecialRouteItem = React.memo(({ route, workspace_id, isActive }) => {
  console.log(`SpecialRouteItem ${route} rendered`);

  const { icon, label } = ROUTE_MAP[route];

  return (
    <SidebarMenuItem key={route}>
      <Link to={`/workspace/${workspace_id}/${route}`}>
        <div
          className={`flex items-center gap-2 px-2 py-1 cursor-pointer ${
            isActive
              ? "bg-(--sidebar-accent) text-white"
              : "hover:bg-(--sidebar-accent)"
          }`}
        >
          <span>{icon}</span>
          <span className="text-[15px]">{label}</span>
        </div>
      </Link>
    </SidebarMenuItem>
  );
});

SpecialRouteItem.displayName = "SpecialRouteItem";

export default SpecialRouteItem;
