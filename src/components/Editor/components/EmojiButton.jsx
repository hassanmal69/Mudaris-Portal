import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import { Smile } from "lucide-react";

export default function EmojiButton({ editor, toolbarStyles }) {
  const [showEmoji, setShowEmoji] = useState(false);
  const handleEmojiSelect = (emoji) => {
    editor.chain().focus().insertContent(emoji.native).run();
    setShowEmoji(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setShowEmoji((v) => !v)}
        title="Add Emoji"
      >
        <Smile style={toolbarStyles} />
      </button>
      {showEmoji && (
        <div className="absolute z-50">
          <EmojiPicker
            onEmojiClick={(emoji) => handleEmojiSelect({ native: emoji.emoji })}
          />
        </div>
      )}
    </div>
  );
}
