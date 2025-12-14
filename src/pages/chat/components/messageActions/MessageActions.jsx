import React, { useCallback, useRef } from "react";
import { MessageSquare } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import { MoreHorizontalIcon, Pin, Trash2, Forward } from "lucide-react";

import {
  fetchPinnedMessages,
  togglePinMessage,
} from "@/redux/features/messages/pin/pinSlice";
const MessageActions = React.memo(
  ({
    messageId,
    message,
    onReply,
    handleOpenDeleteDialog,
    handleForwardDialog,
    userId,
    disableReply,
  }) => {
    const renderCount = useRef(0);
    renderCount.current += 1;
    const dispatch = useDispatch();
    const { groupId, token } = useParams();
    const currentUserId = useSelector((state) => state.auth.session?.user?.id);
    const isPerson = userId === currentUserId;

    const handlePin = useCallback(
      async (messageId) => {
        await dispatch(
          togglePinMessage({
            channelId: groupId,
            messageId,
            userId,
            token: token,
          })
        );

        dispatch(fetchPinnedMessages({ channelId: groupId, token }));
      },
      [groupId, userId, dispatch]
    );

    return (
      <>
        <div className="absolute top-0 right-0  flex gap-1">
          {/* from moiz --- if it is in pin message, reply button is disabled */}
          {!disableReply && (
            <button
              type="button"
              className={`p-1  text-white
                transition-colors  delay-150 duration-300 hover:bg-(--muted) rounded hover:text-[#2b092b]  cursor-pointer`}
              title="Reply"
              onClick={onReply}
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          )}

          {/* <button
          type="button"
          className="p-1 text-white
        transition-colors delay-150 duration-300
        hover:bg-white hover:text-[#2b092b] rounded cursor-pointer"
          title="Reaction"
          onClick={onEmoji}
        >
          <SmilePlus className="w-4 h-4" />
        </button> */}
          {/* {pickerOpenFor === messageId && (
          <div className="absolute z-10 top-8 right-0">
            <EmojiPicker
              onEmojiClick={(emojiObj) => {
                toggleReaction(messageId, emojiObj.emoji);
                setPickerOpenFor(null);
                HandleSupabaseLogicNotification(
                  "reaction",
                  workspace_id,
                  groupId,
                  userId,
                  `${displayName} reacted to your message in ${desiredChannel.name} channel`
                );
              }}
            />
          </div>
        )} */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {/* <Button
                className="bg-transparent"
                aria-label="Open menu"
                size="icon-sm"
              > */}
              <MoreHorizontalIcon />
              {/* </Button> */}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="text-(--muted-foreground) bg-(--accent)/50 border  border-(--accent) rounded-md"
            >
              <DropdownMenuItem onClick={() => handlePin(messageId)}>
                <Pin className="h-4 w-4 mr-2" />
                Pin message
              </DropdownMenuItem>
              {!disableReply && (
                <>
                  <DropdownMenuItem
                    onClick={() => handleForwardDialog(message)}
                  >
                    <Forward className="h-4 w-4 mr-2" />
                    Forward message
                  </DropdownMenuItem>
                  {/* {isPerson && ( */}
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => handleOpenDeleteDialog(messageId)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete message
                  </DropdownMenuItem>
                  {/* )} */}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </>
    );
  }
);

export default MessageActions;
