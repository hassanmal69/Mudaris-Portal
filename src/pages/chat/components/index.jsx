import React, { useState } from "react";
import ReplyDrawer from "./ReplyDrawer";
import MessageList from "./MessageList";
import useMessages from "@/hooks/messages-hook/useMessages.js";
import "./message.css";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AddUserInChannel from "./invite-channel-dialog";
import { useIsAdmin } from "@/constants/constants";
const Messages = () => {
  const isAdmin = useIsAdmin();
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
    forwardMsg,
  } = useMessages();
  const { groupId } = useParams();
  const channel = useSelector(
    (state) => state.channels.byId[groupId],
    shallowEqual
  );
  const [openDialog, setOpenDialog] = useState(false);

  const channel_name = channel?.channel_name || "channel";
  const channel_desc = channel?.description || "description";
  const channel_visbibility = channel?.visibility;
  return (
    <section ref={containerRef} className="messages-container">
      <ReplyDrawer />
      {/* <div ref={loaderRef}>
        {hasMore ? "loading older messages" : "No more messages"}
      </div> */}
      {channel && (
        <>
          <div className="flex flex-col gap-0 items-center">
            <span className="bg-(--standard) text-(--standard-foreground) font-bold w-[65px] text-2xl rounded-md h-[65px] flex items-center justify-center mb-2">
              #
            </span>
            <h1 className=" text-2xl text-(--primary-foreground) font-black ">
              {channel_name}
            </h1>
            <p className="text-(--primary-foreground)">{channel_desc}</p>
            {channel_visbibility === "private" && isAdmin && (
              <Button
                variant={"outline"}
                className="text-(--primary-foreground) cursor-pointer border"
                onClick={() => setOpenDialog(true)}
              >
                add user
              </Button>
            )}
          </div>
        </>
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
        forwardMsg={forwardMsg}
      />
    </section>
  );
};

export default Messages;
