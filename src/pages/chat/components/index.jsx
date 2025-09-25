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

  return (
    <section ref={containerRef} className="messages-container">
      <ReplyDrawer />
      <div ref={loaderRef}>
        {hasMore ? "loading older messages" : "No more messages"}
      </div>
      {channel && userRole === "admin" && (
        <div className="relative ">
          <h1 className=" text-3xl text-white font-black">{channel_name}</h1>
          <p className="text-white">
            this channel is created by <span>moiz</span>. This is the very
            beginning of this channel
          </p>
          <Button onClick={() => setOpenDialog(true)}>add user</Button>
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
      />
    </section>
  );
};

export default Messages;
