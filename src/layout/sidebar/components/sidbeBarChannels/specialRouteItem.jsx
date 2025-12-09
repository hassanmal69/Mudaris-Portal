import React from "react";
import { SidebarMenuItem } from "@/components/ui/sidebar";
import { Link, useParams } from "react-router-dom";

const ROUTE_MAP = {
  announcements: { icon: "📢", label: "Announcements" },
  lecturesLink: { icon: "🔗", label: "Lecture's Links" },
  videospresentations: { icon: "🎥", label: "Videos & Presentations" },
};

const SpecialRouteItem = React.memo(({ route, isActive }) => {
  const { workspace_id } = useParams();
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
