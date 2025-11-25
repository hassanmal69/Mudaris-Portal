import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { supabase } from "@/services/supabaseClient.js";
import { useSelector } from "react-redux";
import useHandleIndividual from "./useHandleIndividual.js";
import { Button } from "@/components/ui/button.jsx";
import SideBarDialogue from "./sideBarDialogue.jsx";

//direct message handled here
const SideBarApps = ({ workspace_id }) => {
  const navigate = useNavigate();
  const { session } = useSelector((state) => state.auth);
  const [isShow, setIsShow] = useState(false);
  const [users, setUsers] = useState([]);
  const handleFunction = useHandleIndividual();
  const handleDirectProfile = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("full_name,id,avatar_url")
      .eq("role", "admin");
    if (error) console.log(error);
    const filteredUsers = data.filter((m) => m.id != session?.user?.id);
    setUsers(filteredUsers);
  };
  useEffect(() => {
    handleDirectProfile();
  }, []);

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-(--sidebar-foreground) font-normal text-[16px]">
        Apps
      </SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <div
            className={`flex items-center gap-2 px-2 py-1 cursor-pointer 
                    hover:bg-(--sidebar-accent) font-medium text-sm
                  `}
            onClick={() => navigate(`/workspace/${workspace_id}/market`)}
          >
            Market Insight
          </div>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <div
            className={`flex items-center gap-2 px-2 py-1 cursor-pointer 
                    hover:bg-(--sidebar-accent) font-medium text-sm
                  `}
            onClick={() => navigate(`/workspace/${workspace_id}/calendar`)}
          >
            Economic Calendar
          </div>
        </SidebarMenuItem>
        <SidebarGroupLabel className="text-(--sidebar-foreground) font-normal text-[16px]">
          Direct Messages
        </SidebarGroupLabel>
        {users.map((m, i) => (
          <SidebarMenuItem
            onClick={() => handleFunction(m)}
            className="flex "
            key={i}
          >
            <img className="rounded-full h-9 w-8" src={m.avatar_url} alt="" />
            <div
              className={`flex items-center gap-2 px-2 py-1 cursor-pointer 
                    hover:bg-(--sidebar-accent) font-medium text-sm
                  `}
            >
              {m.full_name}
            </div>
          </SidebarMenuItem>
        ))}
        <SidebarMenuItem className="flex ">
          <Button variant={"ghost"} onClick={() => setIsShow((prev) => !prev)}>
            See Personal Messages
          </Button>
        </SidebarMenuItem>
      </SidebarMenu>
      {isShow && <SideBarDialogue />}
    </SidebarGroup>
  );
};

export default SideBarApps;
