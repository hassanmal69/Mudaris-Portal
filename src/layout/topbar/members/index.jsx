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
import UserFallback from "@/components/ui/userFallback";

const Members = ({ members }) => {
  const MAX_RENDER = 3;
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const renderMembers = () => {
    setOpen(true);
  };
  const renderCount = React.useRef(0);
  renderCount.current += 1;
  console.log(`members renders: ${renderCount.current}`);

  // Placeholder avatar for "no members"
  const renderEmptyAvatar = () => (
    <Avatar
      className="w-8 h-8 border  border-[#c1c1c1] bg-transparent flex items-center justify-center"
      aria-hidden="true"
    >
      <AvatarImage
        src="https://cdn.shadcnstudio.com/ss-assets/avatar/avatar-5.png"
        alt="Hallie Richards"
        className="rounded-sm"
      />
    </Avatar>
  );
  console.log("members are ", members);
  const filteredUsers = React.useMemo(() => {
    const term = search.toLowerCase();
    return (members || []).filter((m) => {
      const name = (m.user_profiles?.full_name || "").toLowerCase();
      const email = (m.user_profiles?.email || "").toLowerCase();
      return name.includes(term) || email.includes(term);
    });
  }, [members, search]);

  return (
    <>
      <div className="flex items-center gap-1 py-1 px-1 border border-[#c1c1c1] rounded-sm member-container">
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={members.length > 0 ? renderMembers : undefined}
        >
          {members.length === 0
            ? renderEmptyAvatar()
            : members.slice(0, MAX_RENDER).map((user, idx) => {
                const name = user.user_profiles?.full_name;
                const avatar = user.user_profiles?.avatar_url;

                return avatar ? (
                  <Avatar
                    key={user.id}
                    className="w-8 h-8 border border-[#c1c1c1] shadow"
                  >
                    <AvatarImage src={avatar} alt={name} />
                    <AvatarFallback>
                      {name?.[0]?.toUpperCase() || "?"}
                    </AvatarFallback>
                  </Avatar>
                ) : (
                  <div key={user.id}>
                    <UserFallback name={name} _idx={idx} />
                  </div>
                );
              })}

          {members.length > MAX_RENDER && (
            <span className="text-[#eee] text-[14px]">
              {members.length - MAX_RENDER}+
            </span>
          )}
        </div>
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
                      <div>
                        <UserFallback name={name} _idx={idx} />
                      </div>
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

export default React.memo(Members);
