import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input"; // Adjust import path if needed
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Adjust import path if needed
import Profile from "@/pages/profile";
import { useParams } from "react-router-dom";
import { supabase } from "@/services/supabaseClient.js";
const mockUsers = [
  { id: 1, name: "Alice", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Bob", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Charlie", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "Dana", avatar: "https://i.pravatar.cc/150?img=4" },
  { id: 5, name: "Eve", avatar: "https://i.pravatar.cc/150?img=5" },
  { id: 6, name: "Frank", avatar: "https://i.pravatar.cc/150?img=6" },
];
const currentUser = { name: "You", avatar: "https://i.pravatar.cc/150?img=7" };
const channelName = "#general";

const Topbar = () => {
  const maxAvatars = 5;
  const { workspace_id } = useParams();

  const visibleUsers = mockUsers.slice(0, maxAvatars);
  const extraCount = mockUsers.length - maxAvatars;
  const [isProfile, setisProfile] = useState(false);
  const [members, setMembers] = useState([]);
  useEffect(() => {
    const getWorkspaceMembers = async () => {
      const { data, error } = await supabase
        .from("workspace_members")
        .select(
          `
    role,
    profiles (
      full_name,
      avatar_url
    )
  `
        )
        .eq("workspace_id", workspace_id);
      setMembers(data || []);
      if (error) {
        console.error("Error fetching workspace members:", error);
      }
    };

    getWorkspaceMembers();
  }, [workspace_id]);
  console.log("Members:", members);
  return (
    <section
      className="fixed w-[85%] top-0 bg-white shadow-sm px-2 md:px-6 py-2 flex items-center justify-between gap-2"
      style={{ minHeight: "56px" }}
    >
      <span className="hidden sm:inline-block text-gray-600 font-medium ml-2 truncate max-w-[120px] md:max-w-[200px]">
        {channelName}
      </span>

      {/* Center: Search Input */}
      <div className="flex-1 flex justify-center px-2">
        <Input
          type="text"
          placeholder="Search messages"
          className="max-w-xs w-full rounded-md border-gray-300 focus:border-primary"
        />
      </div>

      <div className="flex items-center gap-2 min-w-0">
        <div className="flex -space-x-2">
          {members.map((user) => (
            <Avatar
              key={user.id}
              className="w-8 h-8 border-2 border-white shadow"
            >
              <AvatarImage src={user?.avatar_url} alt={user.full_name} />
              <AvatarFallback>{user.full_name}</AvatarFallback>
            </Avatar>
          ))}
          {extraCount > 0 && (
            <Avatar className="w-8 h-8 border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-semibold">
              <AvatarFallback className="text-[#556cd6]">
                +{extraCount}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        {/* Current user avatar */}

        <div className="flex flex-col relative">
          <div onClick={() => setisProfile((prev) => !prev)}>
            <Avatar className="w-9 h-9 border-2 border-primary ml-2">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{}</AvatarFallback>
            </Avatar>
          </div>
          {isProfile && (
            <div className="absolute right-0 top-15 w-70 h-40">
              {" "}
              <Profile />{" "}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Topbar;
