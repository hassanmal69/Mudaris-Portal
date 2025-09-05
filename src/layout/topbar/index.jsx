import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Profile from "@/pages/profile";
import { useParams } from "react-router-dom";
import { supabase } from "@/services/supabaseClient.js";
import "./topbar.css";
import { Globe, Lock } from "lucide-react";
import Members from "./members";
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "@/features/messages/search/searchSlice";
import { Search } from "lucide-react";
import { Notifications } from "./notification";

const Topbar = () => {
  const dispatch = useDispatch();
  const { groupId, workspace_id } = useParams();
  const [visibility, setVisibility] = useState("");
  const [channel_name, setChannel_name] = useState("");

  const query = useSelector((state) => state.search.query);

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
      className=" top-0 w-full bg-[#393E46] shadow-sm topbar-container md:px-6 py-2 flex items-center"
      style={{ minHeight: "56px" }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <h2 className=" text-[#EEEEEE] text-[18px]  font-medium flex gap-0.5 items-center">
          <span>
            {visibility === "public" ? (
              <Globe className="w-5" />
            ) : (
              <Lock className="w-5" />
            )}{" "}
          </span>
          {channel_name}
        </h2>
      </div>

      <div className=" flex-1 flex items-center justify-center">
        <div className="relative ">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search messages"
            onChange={(e) => dispatch(setQuery(e.target.value))}
            value={query}
            className=" w-[500px] h-[40px] rounded-md border-gray-300 focus:border-primary pl-9 "
          />
        </div>
      </div>

      <div className="flex items-center gap-2 min-w-0">
        <Notifications/>
        <Members />
        <Profile />
      </div>
    </section>
  );
};

export default Topbar;
