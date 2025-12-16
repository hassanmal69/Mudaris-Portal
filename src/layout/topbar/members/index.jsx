import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { DialogTitle } from "@radix-ui/react-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import UserFallback from "@/components/ui/userFallback";
import useHandleIndividual from "@/layout/sidebar/components/useHandleIndividual";
import {
  fetchChannelMembersByChannel,
  selectChannelMembers,
} from "@/redux/features/channelMembers/channelMembersSlice";
import { useParams } from "react-router-dom";
import { shallowEqual, useDispatch, useSelector } from "react-redux";

const Members = () => {
  const { groupId } = useParams();
  const dispatch = useDispatch()
  const fetchedUsers = useRef({})
  useEffect(() => {
    if (groupId && !fetchedUsers.current[groupId]) {
      dispatch(fetchChannelMembersByChannel(groupId));
      fetchedUsers.current[groupId] = true;
    }
  }, []);

  const selectingMembers = useMemo(() =>
    selectChannelMembers(groupId),
    [groupId]
  );
  const members = useSelector(selectingMembers, shallowEqual);
  const handleFunction = useHandleIndividual();

  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const renderMembers = () => {
    setOpen(true);
  };

  const sortedMembers = React.useMemo(() => {
    const list = (members || []).slice();
    list.sort((a, b) => {
      const aName = (
        a.user_profiles?.full_name ||
        a.user_profiles?.email ||
        ""
      ).toLowerCase();
      const bName = (
        b.user_profiles?.full_name ||
        b.user_profiles?.email ||
        ""
      ).toLowerCase();
      if (aName < bName) return -1;
      if (aName > bName) return 1;
      return 0;
    });
    return list;
  }, [members]);

  const filteredUsers = React.useMemo(() => {
    const term = search.toLowerCase();
    return sortedMembers.filter((m) => {
      const name = (m.user_profiles?.full_name || "").toLowerCase();
      const email = (m.user_profiles?.email || "").toLowerCase();
      return name.includes(term) || email.includes(term);
    });
  }, [sortedMembers, search]);

  return (
    <>
      {members.length > 0 && (
        <div className="flex items-center gap-1 py-1 px-3 bg-(--primary)   max-w-full rounded member-container mr-1.5">
          <div
            className="flex items-center  cursor-pointer"
            onClick={sortedMembers.length > 0 ? renderMembers : undefined}
          >
            {sortedMembers.length && (
              <span className="text-(--secondary-foreground) items-center text-sm flex gap-0.5">
                <Users className="w-4 h-4" />
                <p> {sortedMembers.length}</p>
              </span>
            )}
          </div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md p-0 bg-(--background) border-(--border)">
          <DialogHeader className="sticky top-0 z-10  p-4 border-(--border) border-b">
            <DialogTitle className="text-3xl font-bold text-(--primary-foreground)">
              All Members
            </DialogTitle>
            <DialogDescription className="text-[14px] text-(--accent-forground)">
              A complete list of all members in this group.
            </DialogDescription>
            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 border-(--border)"
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
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-2 border-b border-(--border) py-2">
                      {avatar ? (
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={avatar} alt={name} />
                          <AvatarFallback>
                            {name?.[0]?.toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                      ) : (
                        <div>
                          <UserFallback name={name} _idx={idx} />
                        </div>
                      )}

                      <div className="flex flex-col">
                        <h2 className="text-(--primary-foreground) font-bold ">
                          {name}
                        </h2>
                        <p className="text-[#aaa] text-[12px]">
                          {user.user_profiles?.email}
                        </p>
                      </div>
                    </div>

                    <Button
                      variant={"ghost"}
                      onClick={() => {
                        setOpen(false);
                        handleFunction({ ua: { id: user.user_id } });
                      }}
                    >
                      Message
                    </Button>
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
