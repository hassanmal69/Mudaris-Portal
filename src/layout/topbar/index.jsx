import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Profile from "@/pages/profile";
import { useParams } from "react-router-dom";
import { supabase } from "@/services/supabaseClient.js";
import "./topbar.css";
import { Globe, Lock } from "lucide-react";
import Members from "./members";

const Topbar = () => {
  const { groupId, workspace_id } = useParams();
  const [visibility, setVisibility] = useState("");
  const [channel_name, setChannel_name] = useState("");

  useEffect(() => {
    const getChannelData = async () => {
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
      if (error) {
        console.error("Error fetching workspace members:", error);
      }

      let { data: channels, error: channelName_error } = await supabase
        .from("channels")
        .select("channel_name, visibility")
        .eq("id", groupId)
        .single();
      setChannel_name(channels?.channel_name || "channel");
      setVisibility(channels?.visibility);
    };

    getChannelData();
  }, [groupId]);

  return (
    <section
      className=" top-0 bg-white shadow-sm topbar-container md:px-6 py-2 flex items-center"
      style={{ minHeight: "56px" }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <h2 className="text-gray-600 font-medium flex gap-0.5">
          <span>{visibility === "public" ? <Globe /> : <Lock />} </span>
          {channel_name}
        </h2>
      </div>

      <div className="flex-1 flex justify-center px-2">
        <Input
          type="text"
          placeholder="Search messages"
          className="max-w-xs w-full rounded-md border-gray-300 focus:border-primary"
        />
      </div>

      <div className="flex items-center gap-2 min-w-0">
        <Members />
        <Profile />
      </div>
    </section>
  );
};

export default Topbar;
