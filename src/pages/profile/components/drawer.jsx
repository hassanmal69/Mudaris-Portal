import { Drawer } from "vaul";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "@/redux/features/auth/authSlice.js";
import { useEffect, useState } from "react";
import EditProfile from "./editProfile.jsx";
import { fetchChannels } from "@/redux/features/channels/channelsSlice.js";
import { Clock, Globe, Lock } from "lucide-react";
import { useParams } from "react-router-dom";
import { selectChannels } from "@/redux/features/channels/channelsSlice.js";
import "../profile.css";
export default function VaulDrawer() {
  const { workspace_id } = useParams();
  const { session } = useSelector((state) => state.auth);
  const [avatarUrl, setAvatarUrl] = useState(
    session?.user?.user_metadata.avatar_url
  );
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logOut());
  };

  const channels = useSelector(selectChannels);

  const [time, setTime] = useState(new Date());
  // const loading = useSelector((state) => state.channels.loading);

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval); // cleanup on unmount
  }, [workspace_id, dispatch]);
  useEffect(() => {
    setAvatarUrl(session?.user?.user_metadata.avatar_url);
  }, [session?.user?.user_metadata.avatar_url]);
  useEffect(() => {
    if (workspace_id) {
      dispatch(fetchChannels(workspace_id));
    }
  }, [workspace_id, dispatch]);

  return (
    <Drawer.Root direction="right" modal={true}>
      <Drawer.Trigger className="relative flex h-10 flex-shrink-0 items-center justify-center gap-2 rounded-full bg-white px-4 text-sm font-medium shadow-sm transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:hover:bg-[#1A1A19] dark:text-white">
        <img
          src={avatarUrl}
          alt="profileImg"
          className="absolute rounded-full object-cover"
        />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 overflow-scroll" />
        <Drawer.Content
          className="right-2 top-2 bottom-2 fixed z-10 h-full
          after:bottom-0
          after:w-0
          outline-none w-[400px] responsive_drawer_profile rounded-md text-white bg-black/90 flex flex-col "
          style={{ "--initial-transform": "calc(100% + 8px)" }}
        >
          {/* Header */}
          <div className="px-6 pt-7">
            <Drawer.Title className="font-bold mb-2 text-2xl text-white w-full">
              Profile
            </Drawer.Title>
            <img
              src={avatarUrl}
              alt="Profile Image"
              className="w-50 h-50 sm:w-70 sm:h-70 rounded-md object-cover"
            />
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-6 mt-5 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
            <div className="flex w-full flex-col gap-2.5">
              <div className="flex my-3 justify-between">
                <Drawer.Title className="font-medium mb-2 text-2xl text-white ">
                  {session?.user?.user_metadata?.displayName}
                </Drawer.Title>
                <div>
                  <EditProfile />
                </div>
              </div>

              <Drawer.Description className="text-zinc-600 profile_active_user">
                active <span className="active_span"></span>
              </Drawer.Description>

              <div className="flex flex-col text-zinc-600">
                <h4 className="text-white">Email address</h4>
                <p>{session?.user?.email}</p>
              </div>

              <div className="text-zinc-600 flex flex-col w-full mb-2">
                <h4 className="text-white">Current Time</h4>
                <p className="flex gap-1 items-center">
                  <Clock className="w-5  h-5" />
                  {time.toLocaleTimeString()}
                </p>
              </div>

              <div className="flex flex-col text-zinc-600">
                <h4 className="text-white text-[18px]">channels</h4>
                {channels.map((ch) => (
                  <p key={ch.id} className="flex gap-1.5 items-center">
                    {ch.visibility === "public" ? (
                      <Globe className="w-4 h-4" />
                    ) : (
                      <Lock className="w-4 h-4" />
                    )}
                    {ch.channel_name}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Footer (always visible) */}
          <div className="px-6 py-4">
            <button className="text-[#556cd6]" onClick={handleLogout}>
              Sign Out
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
