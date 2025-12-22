import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import Profile from "@/pages/profile";
import { useParams } from "react-router-dom";
import { Lock, Search, Users } from "lucide-react";
import Members from "./members";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { setQuery } from "@/redux/features/messages/search/searchSlice";
import { Notifications } from "./notification";
import { SidebarTrigger } from "@/components/ui/sidebar";
import "./topbar.css";
import VaulDrawer from "@/components/Drawer/index.jsx";

// Debounce utility
function debounce(fn, delay) {
  let timer;

  function debounced(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  }

  debounced.cancel = () => clearTimeout(timer);

  return debounced;
}

const Topbar = () => {
  const dispatch = useDispatch();
  const { groupId, token } = useParams();

  // --- State ---
  const [localQuery, setLocalQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  const channel = useSelector(
    (state) => state.channels.byId[groupId],
    shallowEqual
  );

  const directChannel = useSelector(
    (state) => state?.direct?.directChannel,
    shallowEqual
  );
  console.log(directChannel)
  // --- Derived values (no extra state) ---
  const channel_name =
    channel?.channel_name ||
    directChannel?.full_name ||
    "student";

  const visibility = channel?.visibility || "private";

  // --- Debounced Search ---
  const debouncedDispatch = useMemo(
    () =>
      debounce((value) => {
        dispatch(setQuery(value));
      }, 500),
    [dispatch]
  );

  useEffect(() => {
    debouncedDispatch(localQuery);
    return () => debouncedDispatch.cancel();
  }, [localQuery, debouncedDispatch]);

  // --- Resize Handler ---
  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 860);
  }, []);

  useEffect(() => {
    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return (
    <section
      className="top-0 w-full bg-(--sidebar) z-20 shadow-sm md:px-6 py-2 flex items-center topbar-container"
      style={{ minHeight: "56px" }}
    >
      {isMobile && (
        <div className="p-2 flex gap-2">
          <SidebarTrigger className="text-yellow-300 border border-yellow-300 rounded p-2" />
          <p className="text-(--primary-foreground) text-[18px] font-medium">
            Click
          </p>
        </div>
      )}

      <div
        className="flex items-center gap-3 min-w-0">
        {
          token ? (
            <VaulDrawer
              avatarUrl={directChannel?.avatar_url}
              userId={directChannel?.id}
              fullName={directChannel?.full_name}
              email={directChannel?.email}
            />
          ) : (
            <div className="text-(--primary-foreground)">
              {visibility === "public" ? (
                <Users className="w-[15px]" />
              ) : (
                <Lock className="w-[15px]" />
              )}
            </div>
          )
        }
        <div className="flex flex-col text-(--foreground)">
          <h2 className="text-[18px] font-medium flex gap-1 items-center">
            {channel_name}
          </h2>

          {
            token && (
              <p className="text-xs font-light">{directChannel?.email}</p>
            )
          }
        </div>
      </div >

      <div className="hidden sm:flex sm:flex-1 items-center justify-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-(--foreground) w-4 h-4" />
          <Input
            type="text"
            name="search"
            id="search"
            placeholder="Search messages"
            value={localQuery}
            onChange={(e) => setLocalQuery(e.target.value)}
            className="w-[500px] h-10 rounded-md text-(--foreground) border-(--border) focus:border-primary pl-9 responsive_search_input"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 min-h-0">
        <Notifications />
        <Members />
        <Profile />
      </div>
    </section >
  );
};

export default Topbar;
