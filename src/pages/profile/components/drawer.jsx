import { Drawer } from 'vaul';
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "../../../features/auth/authSlice.js";
import { useEffect, useState } from 'react';
import { updateValue } from '@/features/ui/profileSlice.js';
import EditProfile from './editProfile.jsx';
export default function VaulDrawer() {
  const { session } = useSelector((state) => state.auth);
  const [avatarUrl, setAvatarUrl] = useState(session?.user?.user_metadata.avatar_url)
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logOut());
  };
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval); // cleanup on unmount
  }, []);
  useEffect(() => {
    setAvatarUrl(session?.user?.user_metadata.avatar_url)
  }, [session?.user?.user_metadata.avatar_url])
  return (
    <Drawer.Root direction="right" modal={true}>
      <Drawer.Trigger className="relative flex h-10 flex-shrink-0 items-center justify-center gap-2 overflow-hidden rounded-full bg-white px-4 text-sm font-medium shadow-sm transition-all hover:bg-[#FAFAFA] dark:bg-[#161615] dark:hover:bg-[#1A1A19] dark:text-white">
        <img
          src={avatarUrl}
          alt="profileImg"
          className="absolute rounded-full object-cover" />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content
          className="right-2 top-2 bottom-2 fixed z-10 outline-none w-[310px] flex"
          // The gap between the edge of the screen and the drawer is 8px in this case.
          style={{ '--initial-transform': 'calc(100% + 8px)' }}
        >
          <div className="bg-zinc-50 h-full w-full grow p-5 flex flex-col rounded-[16px]">
            <div className="flex h-full w-full flex-col items-center justify-center">
              <img
                // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiJQHCxo4M5IWzyJgHlB-NBbJuRStycN-PRg&s"
                src={avatarUrl}
                alt="larry"
                className='w-60 h-60 object-cover' />
              <div className="flex justify-between w-full">
                <Drawer.Title className="font-medium mb-2 text-2xl text-zinc-900">
                  {session?.user?.user_metadata?.displayName}
                </Drawer.Title>
                <div onClick={() => dispatch(updateValue())}>
                  <EditProfile />
                </div>
              </div>
              <button onClick={handleLogout}>Sign Out</button>
              <Drawer.Description className="text-zinc-600 mb-2">
                Current Time: {time.toLocaleTimeString()}
              </Drawer.Description>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>

  );
}