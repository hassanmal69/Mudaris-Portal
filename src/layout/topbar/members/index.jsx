import React, { useState, useEffect } from "react";
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

const Members = ({ members }) => {
  const MAX_RENDER = 3;

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const renderMembers = () => {
    setOpen(true);
  };
  const fallbackColors = [
    "bg-rose-200",
    "bg-sky-200",
    "bg-emerald-200",
    "bg-amber-200",
    "bg-violet-200",
    "bg-fuchsia-200",
  ];
  const getUserFallback = (name, idx) => {
    // pick a color based on user id or index
    const color = fallbackColors[idx % fallbackColors.length];

    return (
      <Avatar className="w-7 h-7 border-2 border-white rounded-sm flex items-center justify-center">
        <AvatarFallback
          className={`text-[#333]  text-sm rounded-none font-semibold ${color}`}
        >
          {name?.[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  };
  console.log('members are ', members);
  const filteredUsers = members.filter((m) => {
    const name = (m.user_profiles?.full_name || "").toLowerCase();
    const email = (m.user_profiles?.email || "").toLowerCase();
    const term = search.toLowerCase();
    return name.includes(term) || email.includes(term);
  });
  useEffect(() => {
    console.log("aa", members);
  }, [members]);
  return (
    <>
      <div className="flex items-center gap-1 py-1 px-1 border border-[#c1c1c1] rounded-sm member-container">
        <div className="flex -space-x-3">
          {members.slice(0, MAX_RENDER).map((user, idx) => {
            const name = user.user_profiles?.full_name;
            const avatar = user.user_profiles?.avatar_url;

            return avatar ? (
              <Avatar
                key={user.id}
                className="w-8 h-8 border rounded-sm border-[#c1c1c1] shadow"
              >
                <AvatarImage src={avatar} alt={name} />
                <AvatarFallback>
                  {name?.[0]?.toUpperCase() || "?"}
                </AvatarFallback>
              </Avatar>
            ) : (
              <div key={user.id}>{getUserFallback(name, idx)}</div>
            );
          })}
        </div>
        {MAX_RENDER < members.length && (
          <button onClick={renderMembers} className="text-[#eee] text-[14px]">
            {members.length - MAX_RENDER}+
          </button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md p-0 bg-black/70 border-[#222]">
          <DialogHeader className="sticky top-0 z-10  p-4 border-[#222] border-b">
            <DialogTitle className="text-3xl font-bold text-[#556cd6]">
              All Members
            </DialogTitle>
            <DialogDescription className="text-[16px] text-[#a9a9a9]">
              A complete list of all members in this group.
            </DialogDescription>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 border-[#333] bg-[#111]"
              />
            </div>
          </DialogHeader>

          <div className="max-h-[500px] overflow-y-auto p-4 custom-scrollbar">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, idx) => {
                const name = user.user_profiles?.full_name;
                const avatar = user.user_profiles?.avatar_url;

                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-2 border-b border-[#111] py-2"
                  >
                    {avatar ? (
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={avatar} alt={name} />
                        <AvatarFallback>
                          {name?.[0]?.toUpperCase() || "?"}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      // Use fallback if no avatar
                      <div>{getUserFallback(name, idx)}</div>
                    )}

                    <div className="flex flex-col">
                      <h2 className="text-[#556cd6] font-bold text-[16px]">
                        {name}
                      </h2>
                      <p className="text-[#aaa] text-[12px]">
                        {user.user_profiles?.email}
                      </p>
                    </div>
                  </div>
                );
              })
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
[
  {
    id: "c7382c90-bd3f-4e98-bab6-668376e050d0",
    role: "user",
    user_profiles: {
      id: "99cb0492-a3f0-4f1d-ac52-b6acc73e0a7e",
      email: "admin@gmail.com",
      full_name: "moiz&Hassan",
      avatar_url: null,
    },
  },
  {
    id: "95933ec2-23d7-4c7a-a0ef-6fdac8d9cbc2",
    role: "user",
    user_profiles: {
      id: "303178de-1c82-4e23-9f9f-ba58b06b1157",
      email: "moiza8684@gmail.com",
      full_name: "Abdul Moiz",
      avatar_url: null,
    },
  },
  {
    id: "44b609d3-7139-4dfb-a4c3-cf9e804d32dc",
    role: "user",
    user_profiles: {
      id: "f1c45397-3c5f-43f4-848c-5d80d61f1949",
      email: "user01@gmail.com",
      full_name: "nigga02",
      avatar_url: null,
    },
  },
  {
    id: "7528adc4-00ef-4eee-89aa-5dcffa01a2b2",
    role: "user",
    user_profiles: {
      id: "eb86eda1-d76a-4b06-b8f9-f2ed785293dd",
      email: "user02@gmail.com",
      full_name: "nigga",
      avatar_url: null,
    },
  },
];
