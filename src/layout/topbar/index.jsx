import React, { useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import Profile from "@/pages/profile";
import { useParams } from "react-router-dom";
import { Globe, Lock, Search } from "lucide-react";
import Members from "./members";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setQuery } from "@/features/messages/search/searchSlice";
import { Notifications } from "./notification";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  fetchChannelMembersByChannel,
  selectChannelMembers,
} from "@/features/channelMembers/channelMembersSlice";
import "./topbar.css";

// Debounce utility
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const Topbar = () => {
  const dispatch = useDispatch();
  const { groupId } = useParams();
  // --- State ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 860);
  const [mode, setMode] = useState(localStorage.getItem("theme") || "dark");

  // --- Fetch channel members ---
  useEffect(() => {
    if (groupId) {
      dispatch(fetchChannelMembersByChannel(groupId));
    }
  }, [groupId, dispatch]);

  // --- Apply initial theme ---
  useEffect(() => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", mode);
  }, [mode]);

  // --- Theme toggle ---
  const handleToggle = () => {
    setMode((prevMode) => (prevMode === "dark" ? "light" : "dark"));
  };

  // --- Channel data ---
  const channel = useSelector(
    (state) => state.channels.byId[groupId],
    shallowEqual
  );
  const channelMembers = useSelector(
    selectChannelMembers(groupId),
    shallowEqual
  );
  const visibility = channel?.visibility || "private";
  const directChannel = useSelector((state) => state?.direct?.directChannel);
  const channel_name = channel?.channel_name || directChannel || "channel";

  // --- Search Query ---
  const query = useSelector((state) => state.search.query);
  const debouncedQuery = useMemo(
    () =>
      debounce((value) => {
        dispatch(setQuery(value));
      }, 500),
    [dispatch]
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 860);
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      className="top-0 w-full bg-(--sidebar) z-20 shadow-sm md:px-6 py-2 flex items-center topbar-container"
      style={{ minHeight: "56px" }}
    >
      {isMobile && (
        <div className="p-2">
          <SidebarTrigger className="text-white border border-white rounded p-2">
            <span>☰</span>
          </SidebarTrigger>
        </div>
      )}

      <div className="flex items-center gap-2 min-w-0">
        <h2 className="text-[var(--foreground)] text-[18px] font-medium flex gap-1 items-center">
          {visibility === "public" ? (
            <Globe className="w-[15px]" />
          ) : (
            <Lock className="w-[15px]" />
          )}
          {channel_name}
        </h2>
      </div>

      <div className="hidden sm:flex sm:flex-1 items-center justify-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            name="search"
            id="search"
            placeholder="Search messages"
            value={query}
            onChange={(e) => debouncedQuery(e.target.value)}
            className="w-[500px] h-[40px] rounded-md text-[#eee] border-[#777] focus:border-primary pl-9 responsive_search_input"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={handleToggle}
          className="text-sm text-(--foreground) bg-[#444] hover:bg-[#555] px-3 py-1 rounded-md transition"
        >
          Toggle {mode === "dark" ? "☀️" : "🌙"}
        </button>
        <Notifications />
        <Members members={channelMembers} />
        <Profile />
      </div>
    </section>
  );
};

export default Topbar;
