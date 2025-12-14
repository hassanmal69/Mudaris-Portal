import { Drawer } from "vaul";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { logOut } from "@/redux/features/auth/authSlice.js";
import React, { useEffect, useMemo, useState } from "react";
import EditProfile from "./editProfile.jsx";
import { Clock, Globe, Lock } from "lucide-react";
import { useParams } from "react-router-dom";
import "../profile.css";
import { Button } from "@/components/ui/button.jsx";
import { selectChannelsByUser } from "@/redux/features/channelMembers/channelMembersSlice.js";
const ClockTicker = React.memo(() => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return <>{time.toLocaleTimeString()}</>;
});

function VaulDrawer() {
  const { workspace_id } = useParams();
  const {
    avatar_url: aUrl,
    fullName,
    email
  } = useSelector((state) => state.auth?.user?.user_metadata || {}, shallowEqual);
  const { session } = useSelector((state) => (state.auth), shallowEqual);
  const userId = useMemo(() => session?.user?.id, [session?.user?.id]); // stable userId
  const [avatarUrl, setAvatarUrl] = useState(aUrl);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logOut());
  };
  console.count('parent')
  const channels = useSelector(
    selectChannelsByUser(userId, workspace_id),
    shallowEqual
  );

  useEffect(() => {
    setAvatarUrl(aUrl);
  }, [aUrl]);

  return (
    <Drawer.Root direction="right" modal={true}>
      <Drawer.Trigger className="relative flex w-10 h-10 items-center justify-center gap-2 rounded-md ">
        <img
          src={avatarUrl}
          alt="profileImg"
          className=" rounded-md hover:cursor-pointer object-cover w-10 h-10"
        />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-(--background) overflow-scroll" />
        <Drawer.Content
          className="right-2 top-2 bottom-2 fixed z-10 h-full
          after:bottom-0
          after:w-0
          outline-none w-[400px] responsive_drawer_profile rounded-md text-(--sidebar-accent-foreground) bg-(--dialog) border border-(--border) flex flex-col "
          style={{ "--initial-transform": "calc(100% + 8px)" }}
        >
          {/* Header */}
          <div className="px-6 pt-7">
            <Drawer.Title className="font-bold mb-2 text-2xl text-(--sidebar-accent-foreground) w-full">
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
                <Drawer.Title className="font-medium mb-2 text-2xl text-(--sidebar-accent-foreground) ">
                  {fullName}
                </Drawer.Title>
                <div>
                  <EditProfile />
                </div>
              </div>

              <Drawer.Description className="text-(--muted-foreground) profile_active_user">
                active <span className="active_span"></span>
              </Drawer.Description>

              <div className="flex flex-col  ">
                <h4 className="text-(--sidebar-accent-foreground)">
                  Email address
                </h4>
                <p className="text-(--muted-foreground)">{email}</p>
              </div>

              <div className=" flex flex-col w-full mb-2">
                <h4 className="text-(--sidebar-accent-foreground)">
                  Current Time
                </h4>
                <p className="flex gap-1 text-(--muted-foreground) items-center">
                  <Clock className="w-5  h-5" />
                  <ClockTicker />
                </p>
              </div>

              <div className="flex flex-col text-zinc-600">
                <h4 className="text-(--sidebar-accent-foreground) text-[18px]">
                  channels
                </h4>
                {channels.map((ch) => (
                  <p
                    key={ch.id}
                    className="flex 
                  text-(--muted-foreground)
                  gap-1.5 items-center"
                  >
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
            <Button variant={"secondary"} onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
export default React.memo(VaulDrawer);
VaulDrawer.whyDidYouRender = true;