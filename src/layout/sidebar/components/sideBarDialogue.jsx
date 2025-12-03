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
import { useNavigate } from "react-router-dom";
import { useIsAdmin } from "@/constants/constants";

const SideBarDialogue = () => {
  const [open, setOpen] = useState(true);
  const [data, setData] = useState([]);
  const handleFunction = useHandleIndividual();
  const navigate = useNavigate()
  const { session } = useSelector((state) => state.auth);
  const userId = session?.user?.id;
  const isAdmin = useIsAdmin()
  const fetchChats = async () => {
    const { data: chats, error } = await supabase
      .from("directMessagesChannel")
      .select(
        `
          id,
          sender_id,
          receiver_id,
          sender:sender_id ( id, full_name, avatar_url ),
          receiver:receiver_id ( id, full_name, avatar_url )
        `
      )
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

    if (error) console.error(error);
    setData(chats || []);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
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

          {data.map((item) => {
            const user =
              item.sender_id === userId ? item.receiver : item.sender;

            return (
              <div
                key={item.id}
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

                  <Button
                    onClick={() => handleFunction(user)}
                    variant={"primary"}
                  >
                    Tap to view full conversation
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
        {
          isAdmin && (
            <Button onClick={() => navigate('/seePersonalChats')}>handle</Button>
          )
        }
      </DialogContent>
    </Dialog>
  );
};

export default SideBarDialogue;
