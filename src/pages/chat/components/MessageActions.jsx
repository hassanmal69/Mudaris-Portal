import React, { useCallback, useRef } from "react";
import { MessageSquare } from "lucide-react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import { MoreHorizontalIcon, Pin, Trash2, Forward } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import {
  fetchPinnedMessages,
  togglePinMessage,
} from "@/features/messages/pin/pinSlice";
const MessageActions = React.memo(
  ({ messageId, onReply, onDelete, userId, disableReply }) => {
    const renderCount = useRef(0);
    renderCount.current += 1;
    console.log(`MessageActions renders: ${renderCount.current}`);
    const dispatch = useDispatch();
    const { groupId } = useParams();
    // const displayName = useSelector(
    //   (state) => state.auth.user?.user_metadata?.displayName
    // );
    // const channelState = useSelector((state) => state.channels);
    // const channels = channelState.allIds.map((id) => ({
    //   id,
    //   name: channelState.byId[id]?.channel_name,
    //   visibility: channelState.byId[id]?.visibility,
    // }));
    // const desiredChannel = useMemo(() => {
    //   return channels.find((m) => m.id === groupId);
    // }, [channels, groupId]);
    const handlePin = useCallback(
      async (messageId) => {
        await dispatch(
          togglePinMessage({
            channelId: groupId,
            messageId,
            userId,
          })
        );

        dispatch(fetchPinnedMessages(groupId));
      },
      [groupId, userId, dispatch]
    );

    return (
      <div className="absolute top-0 right-0 flex gap-1">
        {/* from moiz --- if it is in pin message, reply button is disabled */}
        {!disableReply && (
          <button
            type="button"
            className="p-1  text-white transition-colors delay-150 duration-300 hover:bg-(--muted) rounded hover:text-[#2b092b]  cursor-pointer"
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

        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                className="bg-transparent"
                aria-label="Open menu"
                size="icon-sm"
              >
                <MoreHorizontalIcon />
              </Button>
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
                  <DropdownMenuItem>
                    <Forward className="h-4 w-4 mr-2" />
                    Forward message
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => {
                      if (window.confirm("Delete this message?")) {
                        onDelete?.(messageId);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete message
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  }
);

export default MessageActions;
