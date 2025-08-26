import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Members = () => {
  const MAX_RENDER = 3;
  const mockUsers = Array.from({ length: 180 }, (_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@user.com`,
    avatar: `https://i.pravatar.cc/150?img=${(i % 70) + 1}`,
  }));
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const renderMembers = (params) => {
    setOpen(true);
  };

  const filteredUsers = mockUsers.filter((user) => {
    const name = (user.name || "").toLowerCase();
    const email = (user.email || "").toLowerCase();
    const term = search.toLowerCase();

    return name.includes(term) || email.includes(term);
  });
  return (
    <>
      <div className="flex items-center gap-1 py-1 px-1 border border-[#ddd] rounded-xl  member-container">
        <div className="flex -space-x-3">
          {mockUsers.slice(0, MAX_RENDER).map((user) => (
            <Avatar
              key={user.id}
              className="w-8 h-8 border-2 border-white shadow"
            >
              <AvatarImage src={user?.avatar} alt={user.full_name} />
              <AvatarFallback>{user.full_name}</AvatarFallback>
            </Avatar>
          ))}
        </div>
        {MAX_RENDER < mockUsers.length && (
          <button onClick={renderMembers} className="text-[#777] text-[14px]">
            {mockUsers.length - MAX_RENDER}+
          </button>
        )}
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md p-0">
          <DialogHeader className="sticky top-0 z-10 bg-white p-4 border-b">
            <DialogTitle className="text-3xl font-black text-[#556cd6]">
              All Members
            </DialogTitle>
            <DialogDescription className="text-[16px] text-[#222]">
              A complete list of all members in this group.
            </DialogDescription>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </DialogHeader>

          <div className="max-h-[500px] overflow-y-auto p-4 custom-scrollbar">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center gap-2 border-b py-2"
                >
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h2 className="text-[#556cd6] font-bold text-[16px]">
                      {user.name}
                    </h2>
                    <p className="text-[#aaa] text-[12px]">{user.email}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No members found</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default Members;
