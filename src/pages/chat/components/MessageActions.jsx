import { SmilePlus, MessageSquareReply } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import HandleSupabaseLogicNotification from "@/layout/topbar/notification/handleSupabaseLogicNotification.js";
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const MessageActions = ({
  messageId,
  onReply,
  onEmoji,
  pickerOpenFor,
  setPickerOpenFor,
  toggleReaction,
}) => {
  const { workspace_id, groupId } = useParams();
  const userId = useSelector((state) => state.auth.user?.id);
  const displayName = useSelector((state) => state.auth.user?.user_metadata?.displayName);
  return (
    <div className="absolute top-0 right-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
      <button
        type="button"
        className="p-1 hover:bg-gray-100 rounded"
        title="Reply"
        onClick={onReply}
      >
        <MessageSquareReply className="w-4 h-4" />
      </button>
      <button
        type="button"
        className="p-1 hover:bg-gray-100 rounded"
        title="Reaction"
        onClick={onEmoji}
      >
        <SmilePlus className="w-4 h-4" />
      </button>
      {pickerOpenFor === messageId && (
        <div className="absolute z-10 top-8 right-0">
          <EmojiPicker
            onEmojiClick={(emojiObj) => {
              toggleReaction(messageId, emojiObj.emoji);
              setPickerOpenFor(null);
              HandleSupabaseLogicNotification("reaction", workspace_id, groupId, displayName, userId)

            }}
          />
        </div>
      )}
    </div>
  )
};

export default MessageActions;