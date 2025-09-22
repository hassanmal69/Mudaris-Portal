import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import Profile from "@/pages/profile";
import { useParams } from "react-router-dom";
import { Globe, Lock, Search } from "lucide-react";
import Members from "./members";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setQuery } from "@/features/messages/search/searchSlice";
import { Notifications } from "./notification";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { fetchChannelMembers } from "@/features/channelMembers/channelMembersSlice";
const Topbar = () => {
  const dispatch = useDispatch();
  const { groupId } = useParams();

  // Safe selector
  const channel = useSelector(
    (state) => state.channels.byId[groupId],
    shallowEqual
  );

  const visibility = channel?.visibility || "private";
  const channel_name = channel?.channel_name || "channel";

  const query = useSelector((state) => state.search.query);
  const channelMembersState = useSelector(
    (state) => state.channelMembers.byChannelId[groupId],
    shallowEqual
  );

  const channelMembers = channelMembersState?.data || [];
  const membersStatus = channelMembersState?.status || "idle";

  console.log("checking channel members", channelMembers, membersStatus);

  useEffect(() => {
    if (groupId) {
      dispatch(fetchChannelMembers(groupId));
    }
  }, [groupId, dispatch]);
  console.log("checking channel members", channelMembers);
  return (
    <section
      className="top-0 w-full bg-[#2b092b] z-20 shadow-sm topbar-container md:px-6 py-2 flex items-center"
      style={{ minHeight: "56px" }}
    >
      <div className="p-2">
        <SidebarTrigger className="text-white border border-white rounded p-2">
          <span>☰</span>
        </SidebarTrigger>
      </div>

      <div className="flex items-center gap-2 min-w-0">
        <h2 className="text-[#EEEEEE] text-[18px] font-medium flex gap-0.5 items-center">
          {visibility === "public" ? (
            <Globe className="w-5" />
          ) : (
            <Lock className="w-5" />
          )}
          {channel_name}
        </h2>
      </div>


      <div className="hidden sm:flex sm:flex-1 items-center justify-center">
        <div className="relative ">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search messages"
            value={query}
            onChange={(e) => {
              if (e.target.value !== query) {
                dispatch(setQuery(e.target.value));
              }
            }}
            className="w-[500px] h-[40px] rounded-md text-[#eee] border-[#777] focus:border-primary pl-9"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 min-w-0">
        <Notifications />
        <Members members={channelMembers} />
        <Profile />
      </div>
    </section>
  );
};

export default Topbar;
