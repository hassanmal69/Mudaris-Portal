import MessageActions from "./MessageActions.jsx";
import MessageContent from "./MessageContent.jsx";
import Reactions from "./Reactions.jsx";
import { useDispatch } from "react-redux";
import { openReplyDrawer } from "@/features/reply/replySlice.js";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar.jsx";

const fallbackColors = [
  "bg-rose-200",
  "bg-sky-200",
  "bg-emerald-200",
  "bg-amber-200",
  "bg-violet-200",
  "bg-fuchsia-200",
];
const MessageItem = ({
  message,
  currentUserId,
  toggleReaction,
  pickerOpenFor,
  setPickerOpenFor,
}) => {
  const { profiles, content, created_at, user_id } = message || {};
  const { full_name, avatar_url } = profiles || {};

  const dispatch = useDispatch();
  const getUserFallback = (name, idx) => {
    // pick a color based on user id or index
    const color = fallbackColors[idx % fallbackColors.length];

    return (
      <Avatar className="w-7 h-7 border-2 border-white rounded-sm flex items-center justify-center">
        <AvatarFallback
          className={`text-[#2b092b]  text-sm rounded-none font-semibold ${color}`}
        >
          {name?.[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  };
  return (
    <div className="flex gap-2 relative border-t border-[#333] py-2.5 group">
      {message.profiles?.avatar_url ? (
        <Avatar className="w-10 h-10 rounded-full">
          <AvatarImage src={avatar_url || ""} alt={full_name || "user"} />
          <AvatarFallback>
            {full_name?.[0]?.toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
      ) : (
        getUserFallback(message.profiles?.full_name, message.id[0])
      )}

      <div className="message-body relative w-full">
        <MessageActions
          messageId={message.id}
          onReply={() => dispatch(openReplyDrawer(message))}
          onEmoji={() => setPickerOpenFor(message.id)}
          pickerOpenFor={pickerOpenFor}
          setPickerOpenFor={setPickerOpenFor}
          toggleReaction={toggleReaction}
        />
        <div className="flex gap-2 items-center">
          <strong className="text-(--foreground) font-normal">
            {message.profiles?.full_name || "Unknown User"}
          </strong>
          <span className="text-xs text-(--muted-foreground)">
            {new Date(created_at).toLocaleTimeString()}
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
  );
};

export default MessageItem;
