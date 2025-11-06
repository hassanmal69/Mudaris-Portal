import React, { useState } from "react";
import ReplyDrawer from "./ReplyDrawer";
import MessageList from "./MessageList";
import useMessages from "@/hooks/messages-hook/useMessages.js";
import "./message.css";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AddUserInChannel from "./invite-channel-dialog";
const Messages = () => {
  const {
    messages,
    currentUserId,
    toggleReaction,
    pickerOpenFor,
    setPickerOpenFor,
    containerRef,
    loaderRef,
    hasMore,
    deleteMessage,
  } = useMessages();
  const { groupId } = useParams();
  const channel = useSelector(
    (state) => state.channels.byId[groupId],
    shallowEqual
  );
  const [openDialog, setOpenDialog] = useState(false);
  const { session } = useSelector((state) => state.auth);
  const userRole = session.user?.user_metadata?.user_role;

  const channel_name = channel?.channel_name || "channel";
  const channel_desc = channel?.description || "description";
  const channel_visbibility = channel?.visibility;
  return (
    <section ref={containerRef} className="messages-container">
      <ReplyDrawer />
      <div ref={loaderRef}>
        {hasMore ? "loading older messages" : "No more messages"}
      </div>
      {channel && (
        <div className="relative mb-3 responsive_channel_header flex flex-col gap-1 p-3.5 border-b border-(--border)">
          <h1 className=" text-3xl text-white font-black ">{channel_name}</h1>
          <p className="text-gray-500">{channel_desc}</p>
          {channel_visbibility === "private" && userRole === "admin" && (
            <Button
              variant={"outline"}
              className="border-gray-500 w-[80px] text-gray-500 hover:bg-(--primary) hover:text-(--primary-foreground)  hover:cursor-pointer"
              onClick={() => setOpenDialog(true)}
            >
              add user
            </Button>
          )}
        </div>
      )}

      <AddUserInChannel
        open={openDialog}
        onClose={() => setOpenDialog(false)}
      />

      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        toggleReaction={toggleReaction}
        pickerOpenFor={pickerOpenFor}
        setPickerOpenFor={setPickerOpenFor}
        onDelete={deleteMessage}
      />
    </section>
  );
};

export default Messages;
