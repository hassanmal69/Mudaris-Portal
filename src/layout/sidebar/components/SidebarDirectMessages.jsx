import React, { useEffect, useState } from "react";
import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage } from "@/components/ui/avatar.jsx";
import { Button } from "@/components/ui/button.jsx";
import useHandleIndividual from "./useHandleIndividual.js";
import SideBarDialogue from "./sideBarDialogue.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdmins } from "@/redux/features/admin/adminSlice.js";

const SidebarDirectMessages = ({ userId }) => {
  const [isShow, setIsShow] = useState(false);
  const handleFunction = useHandleIndividual();
  const { list: admins, status } = useSelector(state => state.admins);
  const dispatch = useDispatch()
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAdmins());
    }
  }, [status, dispatch]);

  const filteredUsers = admins.filter(u => u.id !== userId);

  return (
    <SidebarMenu>
      <SidebarGroupLabel className="text-(--sidebar-foreground) font-normal text-sm">
        Direct Messages
      </SidebarGroupLabel>

      {/* DM LIST */}
      {filteredUsers.map((u) => (
        <SidebarMenuItem
          key={u.id}
          onClick={() => handleFunction(u)}
          className="flex px-2"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage src={u.avatar_url} alt={u.full_name} />
          </Avatar>

          <p className="flex items-center gap-2 px-2 py-1 cursor-pointer 
                        hover:bg-(--sidebar-accent) font-medium text-[15px]">
            {u.full_name}
          </p>
        </SidebarMenuItem>
      ))}

      {/* See More Button */}
      <SidebarMenuItem className="flex">
        <Button variant="ghost" onClick={() => setIsShow((p) => !p)}>
          See Personal Messages
        </Button>
      </SidebarMenuItem>

      {isShow && <SideBarDialogue />}
    </SidebarMenu>
  );
};

export default React.memo(SidebarDirectMessages);
