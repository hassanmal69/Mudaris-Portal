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
import { Calendar, Telescope } from "lucide-react";
import { Avatar, AvatarImage } from "@/components/ui/avatar.jsx";

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
      <SidebarGroupLabel className="text-(--sidebar-foreground) font-normal text-sm px-2 py-1 mb-1">
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
            <span className="bg-(--primary)/10 h-7 w-7 rounded-md flex items-center justify-center">
              <Telescope className="w-4 h-4 text-(--primary)" />
            </span>
            <span className="text-[15px]">Market Insight</span>
          </div>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <div
            className={`flex items-center gap-2 px-2 py-1 cursor-pointer 
                    hover:bg-(--sidebar-accent) font-medium 
                
                  `}
            onClick={() => navigate(`/workspace/${workspace_id}/calendar`)}
          >
            <span className="bg-(--primary)/10 h-7 w-7 rounded-md flex items-center justify-center">
              <Calendar className="w-4 h-4 text-(--primary)" />
            </span>
            <span
              className="
    text-[15px]"
            >
              Economic Calendar
            </span>
          </div>
        </SidebarMenuItem>
        <SidebarGroupLabel className="text-(--sidebar-foreground) font-normal text-sm">
          Direct Messages
        </SidebarGroupLabel>
        {users.map((m, i) => (
          <SidebarMenuItem
            onClick={() => handleFunction(m)}
            className="flex "
            key={i}
          >
            <Avatar className="h-7 w-7">
              <AvatarImage src={m.avatar_url} alt="" />
            </Avatar>

            <p
              className={`flex items-center gap-2 px-2 py-1 cursor-pointer 
                    hover:bg-(--sidebar-accent) font-medium text-[15px]
                  `}
            >
              {m.full_name}
            </p>
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
