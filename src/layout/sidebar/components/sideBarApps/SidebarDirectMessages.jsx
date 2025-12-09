import React, { useEffect, useState, useCallback } from "react";
import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { supabase } from "@/services/supabaseClient";
import { Avatar, AvatarImage } from "@/components/ui/avatar.jsx";
import { Button } from "@/components/ui/button.jsx";
import useHandleIndividual from "../useHandleIndividual.js";
import SideBarDialogue from "../sideBarDialogue.jsx";

const SidebarDirectMessages = ({ userId }) => {
  const [isShow, setIsShow] = useState(false);
  const [users, setUsers] = useState([]);
  const handleFunction = useHandleIndividual();
  const [isLoading, setIsLoading] = useState(false);

  // Fetch Profiles Once
  const fetchAdmins = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, id, avatar_url")
        .eq("role", "admin");

      if (error) {
        console.error("Error fetching admins:", error);
        return;
      }

      // Filter out current user and set users
      if (data) {
        const filteredUsers = data.filter(u => u.id !== userId);
        setUsers(filteredUsers.length > 0 ? filteredUsers : []);
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, isLoading]);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      await fetchAdmins();
    };

    if (isMounted) {
      loadData();
    }

    return () => {
      isMounted = false;
    };
  }, []);
  if (isLoading) {
    return (
      <SidebarMenu>
        <SidebarGroupLabel className="text-(--sidebar-foreground) font-normal text-sm">
          Direct Messages
        </SidebarGroupLabel>
        <SidebarMenuItem>
          <p className="px-2 py-1 text-sm text-gray-500">Loading...</p>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <SidebarMenu>
      <SidebarGroupLabel className="text-(--sidebar-foreground) font-normal text-sm">
        Direct Messages
      </SidebarGroupLabel>

      {/* DM LIST */}
      {users.map((u) => (
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
