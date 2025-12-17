import { SidebarFooter } from "@/components/ui/sidebar";
import React from "react";
import { Button } from "@/components/ui/button";
import { useIsAdmin } from "@/constants/constants.js";

const SideBarFooter = ({ setInviteOpen, handleLogout }) => {
  const isAdmin = useIsAdmin();
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
