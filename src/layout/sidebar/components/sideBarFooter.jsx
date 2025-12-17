import { SidebarFooter } from "@/components/ui/sidebar";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { useIsAdmin } from "@/constants/constants.js";

const SideBarFooter = ({ setInviteOpen, handleLogout }) => {
  const isAdmin = useIsAdmin();
  const renderCount = useRef(0);
  renderCount.current++;
  console.log("Sidebar footer count:", renderCount.current);

  return (
    <SidebarFooter className="mt-auto pb-2">
      {isAdmin && (
        <Button variant="default" size="sm" onClick={() => setInviteOpen(true)}>
          Invite new Users
        </Button>
      )}
      <Button variant={"destructive"} onClick={handleLogout}>
        Sign Out
      </Button>
    </SidebarFooter>
  );
};

export default React.memo(SideBarFooter);
