import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import Profile from "@/pages/profile";
import { useParams } from "react-router-dom";
import "./topbar.css";
import { Globe, Lock } from "lucide-react";
import Members from "./members";
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "@/features/messages/search/searchSlice";
import { Search } from "lucide-react";
import { Notifications } from "./notification";
import {
  fetchWorkspaceMembers,
  selectWorkspaceMembers,
} from "@/features/workspaceMembers/WorkspaceMembersSlice.js";
import {
  SidebarTrigger
} from "@/components/ui/sidebar";
const Topbar = () => {
  const dispatch = useDispatch();
  const { groupId, workspace_id } = useParams();

  // Get channel from Redux
  const channel = useSelector((state) => state.channels.byId[groupId]);

  const [visibility, setVisibility] = useState("");
  const [channel_name, setChannel_name] = useState("");

  const query = useSelector((state) => state.search.query);

  // Fetch workspace members from Redux
  useEffect(() => {
    if (workspace_id) {
      dispatch(fetchWorkspaceMembers(workspace_id));
    }
  }, [workspace_id, dispatch]);

  // Get workspace members from Redux state
  const workspaceMembers = useSelector(selectWorkspaceMembers(workspace_id));

  useEffect(() => {
    if (channel) {
      setChannel_name(channel.channel_name || "channel");
      setVisibility(channel.visibility);
    }
  }, [channel]);

  return (
    <section
      className=" top-0 w-full bg-[#2b092b] z-20 shadow-sm topbar-container md:px-6 py-2 flex items-center"
      style={{ minHeight: "56px" }}
    >
      <div className="p-2">
        <SidebarTrigger className="text-white border border-white rounded p-2">
          <span>☰</span>
        </SidebarTrigger>
      </div>
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
            className=" w-[500px] h-[40px] rounded-md text-[#eee] border-[#777] focus:border-primary pl-9 "
          />
        </div>
      </div>

      <div className="flex items-center gap-2 min-w-0">
        <Notifications />
        <Members members={workspaceMembers} />{" "}
        {/* Pass members as prop if needed */}
        <Profile />
      </div>
    </section>
  );
};

export default Topbar;
