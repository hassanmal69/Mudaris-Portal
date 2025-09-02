import { SmilePlus, MessageSquareReply } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

const MessageActions = ({
  messageId,
  onReply,
  onEmoji,
  pickerOpenFor,
  setPickerOpenFor,
  toggleReaction,
}) => (
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
          }}
        />
      </div>
    )}
  </div>
);

export default MessageActions;