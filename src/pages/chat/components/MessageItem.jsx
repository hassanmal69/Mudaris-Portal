import MessageActions from "./MessageActions.jsx";
import MessageContent from "./MessageContent.jsx";
import Reactions from "./Reactions";
import { useDispatch } from "react-redux";
import { openReplyDrawer } from "@/features/reply/replySlice";

const MessageItem = ({
  message,
  currentUserId,
  toggleReaction,
  pickerOpenFor,
  setPickerOpenFor,
}) => {
  const dispatch = useDispatch();

  return (
    <div className="flex gap-2 relative border-t py-1 group">
      <img
        src={message.profiles?.avatar_url}
        alt={message.profiles?.full_name}
        className="w-8 h-8 rounded-full"
      />
      <div className="message-body relative w-full">
        <MessageActions
          messageId={message.id}
          onReply={() => dispatch(openReplyDrawer(message))}
          onEmoji={() => setPickerOpenFor(message.id)}
          pickerOpenFor={pickerOpenFor}
          setPickerOpenFor={setPickerOpenFor}
          toggleReaction={toggleReaction}
        />
        <strong>{message.profiles?.full_name || "Unknown User"}</strong>
        <MessageContent
          attachments={message.attachments}
          content={message.content}
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
            toggleReaction(message.id, emoji)
          }}
        />
      </div>
    </div>
  );
};

export default MessageItem;
