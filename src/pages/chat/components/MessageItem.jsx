import React, { useReducer, useState } from "react";
import MessageActions from "./messageActions/MessageActions.jsx";
import MessageContent from "./MessageContent.jsx";
import Reactions from "./Reactions.jsx";
import { useDispatch } from "react-redux";
import { openReplyDrawer } from "@/features/reply/replySlice.js";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar.jsx";
import { DeleteDialog } from "./messageActions/components/DeleteDialog.jsx";
import {
  initialState,
  __reducer_local,
} from "./messageActions/components/reducer.js";
import UserFallback from "@/components/ui/userFallback.jsx";
import { ForwardDialog } from "./messageActions/components/ForwardDialog.jsx";
import useMessages from "@/hooks/messages-hook/useMessages.js";

const MessageItem = ({
  message,
  currentUserId,
  toggleReaction,
  pickerOpenFor,
  setPickerOpenFor,
  onDelete,
  forwardMsg
}) => {
  const { profiles, created_at } = message || {};
  const { id, full_name, avatar_url } = profiles || {};
  const [contact, setContact] = useState(false)
  const dispatch = useDispatch();
  const { handleIndividualMessage } = useMessages();

  const [__state_local, __dispatch_local] = useReducer(
    __reducer_local,
    initialState
  );
  const handleConfirmDelete = () => {
    __dispatch_local({ type: "SHOW_DELETE_SUCCESS" });
    window.alert("Message deleted successfully");
    console.log(__state_local.selectedMessageId)

    setTimeout(() => {
      onDelete?.(__state_local.selectedMessageId);
      __dispatch_local({ type: "HIDE_DELETE_SUCCESS" });
    }, 1200);
  };

  const handleOpenDeleteDialog = (messageId) => {
    __dispatch_local({ type: "OPEN_DELETE_DIALOG", payload: messageId });
  };
  const handleForwardDialog = (messageId) => {
    __dispatch_local({ type: "OPEN_FORWARD_DIALOG", payload: messageId });
  };

  const handleConfirmForward = (groups, messageId) => {
    if (!messageId) return;
    __dispatch_local({ type: "SHOW_FORWARD_SUCCESS" });
    window.alert("Message forwarded successfully");
    forwardMsg?.(groups, messageId);
    console.log(groups);
    setTimeout(() => {
      __dispatch_local({ type: "HIDE_FORWARD_SUCCESS" });
    }, 1200);
  };


  const handleReply = React.useCallback(() => {
    dispatch(openReplyDrawer(message));
  }, [dispatch, message]);

  const handleOpenEmoji = React.useCallback(() => {
    setPickerOpenFor(message.id);
  }, [setPickerOpenFor, message]);

  return (
    <>
      <div className="flex gap-2  items-start ">
        <DeleteDialog
          open={__state_local.showDeleteDialog}
          onOpenChange={() => __dispatch_local({ type: "CLOSE_DELETE_DIALOG" })}
          onConfirmDelete={handleConfirmDelete}
        />
        <ForwardDialog
          open={__state_local.showForwardDialog}
          onOpenChange={() => __dispatch_local({ type: "CLOSE_FORWARD_DIALOG" })}
          onConfirmForward={(groups) => handleConfirmForward(groups, __state_local.selectedMessageId)}
        />

        {message.profiles?.avatar_url ? (
          <Avatar className="w-10 h-10 rounded-full">
            <AvatarImage src={avatar_url || ""} alt={full_name || "user"} />
            <AvatarFallback>
              {full_name?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        ) : (
          <UserFallback
            name={message.profiles?.full_name}
            _idx={message.id[0]}
          />
        )}

        <div className="relative message-body w-full  text-(--muted-foreground) group">
          {/* MessageActions: hidden by default, shown when the parent .group is hovered */}
          {/* hassan sending msg obj as i need it in forward msg */}
          <div className="absolute right-2 top-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-150 z-10">
            <MessageActions
              messageId={message.id}
              message={message}
              onReply={handleReply}
              onEmoji={handleOpenEmoji}
              pickerOpenFor={pickerOpenFor}
              setPickerOpenFor={setPickerOpenFor}
              toggleReaction={toggleReaction}
              userId={id}
              handleOpenDeleteDialog={handleOpenDeleteDialog}
              handleForwardDialog={handleForwardDialog}
            />
          </div>
          <div
            // onMouseEnter={() => setContact(true)}
            // onMouseLeave={() => setContact(false)}
            onClick={()=>setContact(prev=>!prev)}
            className="flex relative gap-2 items-center">
            {
              contact && (
                <div
                  className="bg-(--background) absolute -top-10 w-40 h-20 text-(--foreground)">
                  contact krlo baway
                  <button
                    onClick={() =>{console.log('msg is thi',message.profiles); handleIndividualMessage(message.profiles)}}
                    className="bg-gray-600 py-2 px-2">message</button>
                </div>
              )
            }
            <strong
              className="text-(--foreground) font-normal">
              {message.profiles?.full_name || "Unknown User"}
            </strong>
            {message.isForward ? (
              <p className="italic text-xs font-extralight">Message is forwaded</p>
            ) : (
              <p></p>
            )}
            <span className="text-xs text-(--muted-foreground)">
              <LocalTime utcString={created_at} />
            </span>
          </div>

          <MessageContent
            attachments={message.attachments}
            content={message.content}
            id={message.id}
          />

          <div>
            {message.replyCount > 0 && (
              <button
                className="text-[13px] text-[#556cd6] mt-1 font-bold cursor-pointer"
                onClick={() => dispatch(openReplyDrawer(message))}
                title="View replies"
                type="button"
              >
                {message.replyCount}{" "}
                {message.replyCount === 1 ? "reply" : "replies"}
              </button>
            )}
          </div>
          <Reactions
            reactions={message.reactions}
            currentUserId={currentUserId}
            onReact={(emoji) => {
              toggleReaction(message.id, emoji);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default MessageItem;

const LocalTime = ({ utcString }) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const localTime = new Date(utcString).toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: userTimeZone,
  });

  return <span>{localTime.toUpperCase()}</span>;
};
