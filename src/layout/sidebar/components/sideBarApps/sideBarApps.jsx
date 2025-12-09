import React, { useRef } from "react";
import { SidebarGroup } from "@/components/ui/sidebar";
import SidebarAppsList from "./SidebarAppsList.jsx";
import SidebarDirectMessages from "./SidebarDirectMessages.jsx";

const SideBarApps = ({ workspace_id,userId }) => {
  const renderCount = useRef(0);
  renderCount.current++;
  console.log("Sidebar Apps parent count:", renderCount.current);

  return (
    <SidebarGroup className="flex flex-col gap-6">
      <SidebarAppsList userId={userId} workspace_id={workspace_id} />
      <SidebarDirectMessages />
    </SidebarGroup>
  );
};

export default React.memo(SideBarApps);
