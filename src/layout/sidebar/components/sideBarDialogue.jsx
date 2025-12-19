import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog.jsx";
import { supabase } from "@/services/supabaseClient";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import useHandleIndividual from "./useHandleIndividual";
import { useNavigate } from "react-router-dom";
import { useIsAdmin } from "@/constants/constants";
import UserFallback from "@/components/ui/userFallback";
import "./personalDialog.css";
const SideBarDialogue = () => {
  const [open, setOpen] = useState(true);
  const [data, setData] = useState([]);
  const handleFunction = useHandleIndividual();
  const navigate = useNavigate();
  const { session } = useSelector((state) => state.auth);
  const userId = session?.user?.id;
  const isAdmin = useIsAdmin();
  const fetchChats = async () => {
    const { data: chats, error } = await supabase
      .from("direct_message_channels_view")
      .select("*")
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);

    if (error) {
      console.error(error);
      return;
    }

    setData(chats || []);
  };

  console.log(data, "personal data");
  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="personal-dialog-wrapper">
        <DialogHeader className="sticky top-0  p-4 personal-dialog-header bg-(--dialog) border-(--accent) border-b">
          <DialogTitle className="text-2xl font-bold personal-dialog-title text-(--accent-foreground)">
            All Your Personal Chats
          </DialogTitle>
          <DialogDescription className="text-[14px] text-(--accent-foreground) personal-dialog-desc">
            View all of your personal chats in a single, organized space.
            Quickly find and revisit past conversations with ease.{" "}
          </DialogDescription>
        </DialogHeader>

        <section className=" space-y-4  dialog-user-list max-h-125 overflow-y-auto">
          {data.length === 0 && (
            <p className="text-center text-gray-400">No chats found...</p>
          )}

          {data.map((item, i) => {
            const isSender = item.sender_id === userId;

            const user = {
              id: isSender ? item.receiver_id : item.sender_id,
              full_name: isSender ? item.receiver_name : item.sender_name,
              avatar_url: isSender ? item.receiver_avatar : item.sender_avatar,
              email: isSender ? item.receiver_email : item.sender_email,
            };

            return (
              <div
                key={item.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-(--card) border border-(--border)"
              >
                {user?.avatar_url ? (
                  <img
                    src={user?.avatar_url}
                    alt="profileImg"
                    className=" rounded-md hover:cursor-pointer object-cover w-12 h-12"
                  />
                ) : (
                  <UserFallback
                    name={user?.full_name}
                    cn={
                      "rounded-md hover:cursor-pointer object-cover w-12 h-12"
                    }
                    _idx={i}
                  />
                )}

                <div className="flex flex-col w-full">
                  <h4 className="text-[16px] font-bold text-(--primary-foreground)">
                    {user?.full_name}
                  </h4>
                  <div className="flex justify-between items-center gap-1.5 w-full ">
                    <p className="text-(--secondary-foreground) text-[14px]">
                      {user?.email}
                    </p>
                    <DialogClose
                      onClick={() => {
                        handleFunction(user);
                      }}
                      className={"text-(--success) font-bold text-[16px]"}
                      variant={"ghost"}
                    >
                      view
                    </DialogClose>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
        <DialogFooter className={"w-full"}>
          {isAdmin && (
            <Button
              onClick={() => navigate("/seePersonalChats")}
              variant={"success"}
              className={"w-full"}
            >
              handle
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SideBarDialogue;
