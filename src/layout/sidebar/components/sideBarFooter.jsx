import { SidebarFooter } from "@/components/ui/sidebar";
import React from "react";
import { Button } from "@/components/ui/button";
import { isAdmin } from "@/constants/constants";

const SideBarFooter = ({ setInviteOpen, handleLogout }) => {
  return (
    <SidebarFooter className="mt-auto pb-2">
      {isAdmin && (
        <Button variant="default" size="sm" onClick={() => setInviteOpen(true)}>
          Invite new Users
        </Button>
      )}
      <Button variant={"outline"} onClick={handleLogout}>
        Sign Out
      </Button>
    </SidebarFooter>
  );
};

export default SideBarFooter;
