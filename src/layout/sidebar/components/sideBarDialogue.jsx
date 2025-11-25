import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { supabase } from "@/services/supabaseClient";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import useHandleIndividual from "./useHandleIndividual";

const SideBarDialogue = () => {
  const [open, setOpen] = useState(true);
  const [data, setData] = useState([]);
  const handleFunction = useHandleIndividual();

  const { session } = useSelector((state) => state.auth);

  const incomingData = async () => {
    const { data, error } = await supabase
      .from("directMessagesChannel")
      .select(
        `
                sender:sender_id ( full_name, avatar_url, id ),
                receiver:receiver_id ( full_name, avatar_url,id )
            `
      )
      .or(`sender_id.eq.${session.user.id},receiver_id.eq.${session.user.id}`);

    if (error) console.log(error);
    setData(data || []);
  };

  useEffect(() => {
    incomingData();
  }, []);

  return (
    <div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md ">
          <DialogHeader className="sticky top-0 z-10 p-4 border-(--accent) border-b">
            <DialogTitle className="text-3xl font-bold text-(--accent-foreground)">
              All Your Personal Chats
            </DialogTitle>
            <DialogDescription className="text-[16px] text-[#a9a9a9]">
              Here are your complete Chats
            </DialogDescription>
          </DialogHeader>

          <div className="p-4 space-y-4">
            {data.length === 0 && (
              <p className="text-center text-gray-400">No chats found...</p>
            )}

            {data.map((item, index) => {
              const user =
                item.sender?.full_name != session.user.user_metadata.full_name
                  ? item.receiver
                  : item.sender;

              return (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 rounded-lg bg-(--card) border border-[#222]"
                >
                  <img
                    src={user?.avatar_url}
                    alt="avatar"
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {user?.full_name}
                    </h4>
                    <p>{user?.email || "no email"}</p>
                    <Button
                      onClick={() => handleFunction(user)}
                      variant={"secondary"}
                    >
                      Tap to view full conversation
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SideBarDialogue;
