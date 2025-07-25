import React, { useState } from "react";
import AddChannelDialog from "@/components/add-channel-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button"; // Adjust import path if needed
import {
  LockClosedIcon,
  GlobeAltIcon,
  PlusIcon,
} from "@heroicons/react/24/outline"; // Heroicons for icons

const Sidebar = () => {
  const [addChannelOpen, setAddChannelOpen] = useState(false);
  return (
    <>
      <AddChannelDialog
        open={addChannelOpen}
        onOpenChange={setAddChannelOpen}
      />
      <aside
        className="fixed left-0 top-0 py-30 h-screen w-64 bg-white shadow-md flex flex-col z-40 px-3  gap-4 border-r border-gray-100 overflow-y-auto transition-all duration-300 md:w-64 sm:w-56 sm:-translate-x-0"
        style={{ minWidth: "220px" }}
      >
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2">
            Channels
          </h2>
          <ul className="space-y-1">
            {channels.map((channel) => (
              <li
                key={channel.id}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
              >
                {channel.type === "private" ? (
                  <LockClosedIcon className="w-4 h-4 text-gray-400" />
                ) : (
                  <GlobeAltIcon className="w-4 h-4 text-gray-400" />
                )}
                <span className="font-medium text-sm text-gray-800">
                  {channel.name}
                </span>
              </li>
            ))}
          </ul>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full flex items-center gap-2 justify-center"
            onClick={() => setAddChannelOpen(true)}
          >
            <PlusIcon className="w-4 h-4" />
            Add Channel
          </Button>
        </section>

        {/* Direct Messages Section */}
        <section>
          <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2 mt-4">
            Direct Messages
          </h2>
          <ul className="space-y-1">
            {users.map((user) => (
              <li
                key={user.id}
                className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer"
              >
                <Avatar className="w-7 h-7">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm text-gray-800">
                  {user.name}
                </span>
                <span
                  className={`ml-auto w-2 h-2 rounded-full ${
                    user.status === "online" ? "bg-green-500" : "bg-gray-400"
                  }`}
                  title={user.status}
                ></span>
              </li>
            ))}
          </ul>
        </section>

        <div className="pb-2">
          <Button variant="default" size="sm" className="w-full bg-[#556cd6]">
            Invite Users
          </Button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
// Mock data
const channels = [
  { id: 1, name: "general", type: "public" },
  { id: 2, name: "design", type: "public" },
  { id: 3, name: "private-team", type: "private" },
  { id: 4, name: "marketing", type: "public" },
];

const users = [
  {
    id: 1,
    name: "Alice",
    avatar: "https://i.pravatar.cc/150?img=1",
    status: "online",
  },
  {
    id: 2,
    name: "Bob",
    avatar: "https://i.pravatar.cc/150?img=2",
    status: "offline",
  },
  {
    id: 3,
    name: "Charlie",
    avatar: "https://i.pravatar.cc/150?img=3",
    status: "online",
  },
  {
    id: 4,
    name: "Dana",
    avatar: "https://i.pravatar.cc/150?img=4",
    status: "offline",
  },
];
