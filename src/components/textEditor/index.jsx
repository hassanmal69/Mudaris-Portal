import "./styles.scss";
import "./editor.css";
// import EmojiPicker from "react-emoji-picker";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect, useState } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  LinkIcon,
  CodeBracketSquareIcon,
  ListBulletIcon,
  NumberedListIcon,
  CodeBracketIcon,
  ChatBubbleLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import AddOn from "./addon";
import { ClockFading } from "lucide-react";
import { useSelector } from "react-redux";

function TextEditor({ editor }) {
  const editProfileOpen = useSelector(state => state.profile.editProfileOpen);

useEffect(() => {
  if (!editProfileOpen && editor) {
    editor.commands.focus();
  }
}, [editProfileOpen, editor]);

  const [showEmoji, setShowEmoji] = useState(false);
  const editorState = useEditorState({
    editor,
    selector: (ctx) => {
      return {
        isBold: ctx.editor.isActive("bold") ?? false,
        canBold: ctx.editor.can().chain().toggleBold().run() ?? false,
        isItalic: ctx.editor.isActive("italic") ?? false,
        canItalic: ctx.editor.can().chain().toggleItalic().run() ?? false,
        isStrike: ctx.editor.isActive("strike") ?? false,
        canStrike: ctx.editor.can().chain().toggleStrike().run() ?? false,
        isCode: ctx.editor.isActive("code") ?? false,
        canCode: ctx.editor.can().chain().toggleCode().run() ?? false,
        canClearMarks: ctx.editor.can().chain().unsetAllMarks().run() ?? false,
        isLink: ctx.editor.isActive("link") ?? false,
        canLink: ctx.editor.can().chain().setLink({ href: "" }).run() ?? false,
        isBulletList: ctx.editor.isActive("bulletList") ?? false,
        isOrderedList: ctx.editor.isActive("orderedList") ?? false,
        isCodeBlock: ctx.editor.isActive("codeBlock") ?? false,
        isBlockquote: ctx.editor.isActive("blockquote") ?? false,
      };
    },
  });

  const handleEmojiSelect = (emoji) => {
    if (editor) {
      editor.chain().focus().insertContent(emoji.native).run();
    }
    setShowEmoji(false);
  };

  const [msgArr, setMsgArr] = useState([]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const messageHTML = editor.getHTML();
    setMsgArr(prev => [...prev, messageHTML]);
    editor.commands.clearContent();
  };

  return (
    <div className="control-group">
      <div>
        {msgArr.map((m, i) => (
          <div
            key={i}
            className="chat-message"
            dangerouslySetInnerHTML={{ __html: m }}
          />
        ))}
      </div>
      <div className="button-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editorState.canBold}
          className={editorState.isBold ? "is-active" : ""}
          title="Bold"
        >
          <BoldIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editorState.canItalic}
          className={editorState.isItalic ? "is-active" : ""}
          title="Italic"
        >
          <ItalicIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editorState.canStrike}
          className={editorState.isStrike ? "is-active" : ""}
          title="Strikethrough"
        >
          <StrikethroughIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleLink &&
            editor
              .chain()
              .focus()
              .toggleLink({ href: prompt("Enter URL") })
              .run()
          }
          disabled={!editorState.canLink}
          className={editorState.isLink ? "is-active" : ""}
          title="Link"
        >
          <LinkIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editorState.canCode}
          className={editorState.isCode ? "is-active" : ""}
          title="Code"
        >
          <CodeBracketSquareIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editorState.isBulletList ? "is-active" : ""}
          title="Bullet List"
        >
          <ListBulletIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editorState.isOrderedList ? "is-active" : ""}
          title="Ordered List"
        >
          <NumberedListIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editorState.isCodeBlock ? "is-active" : ""}
          title="Code Block"
        >
          <CodeBracketIcon className="w-5 h-5" />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editorState.isBlockquote ? "is-active" : ""}
          title="Blockquote"
        >
          <ChatBubbleLeftEllipsisIcon className="w-5 h-5" />
        </button>
        <button
          type="button"
          onClick={() => setShowEmoji((v) => !v)}
          title="Add Emoji"
        >
          <span role="img" className="w-5 h-5" aria-label="emoji">
            😊
          </span>
        </button>
      </div>
      {showEmoji && (
        <div className="mt-2">
          {/* Replace with your emoji picker import */}
          {/* <EmojiPicker onEmojiClick={(emoji) => handleEmojiSelect({ native: emoji.emoji })} theme="light" /> */}
        </div>
      )}
      <button onClick={handleSubmit}>submit</button>
    </div>
  );
}

export default () => {
  const editProfileOpen = useSelector(state => state.profile.editProfileOpen);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write something...',
      }),
    ],
    content: '',
    editorProps: {
      handleKeyDown(view, event) {
        if (editProfileOpen) {
         return true;
        } // block typing when editProfileOpen is true
        return false;
      },
      attributes: {
        class: "text-editor prose is-editor-empty",
      }
    }
  });

  return (
    <div className="editor-container">
      <TextEditor editor={editor} />
      <EditorContent editor={editor} />
      <AddOn />
    </div>
  );
};
