import "./styles.scss";
import "./editor.css";
// import EmojiPicker from "react-emoji-picker";
import { TextStyleKit } from "@tiptap/extension-text-style";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useState } from "react";
import Placeholder from "@tiptap/extension-placeholder";

const extensions = [
  TextStyleKit,
  StarterKit,
  Placeholder.configure({
    placeholder: "Type your message here...", // your placeholder text
  }),
];
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

function TextEditor({ editor }) {
  const [showEmoji, setShowEmoji] = useState(false);
  // Read the current editor's state, and re-render the component when it changes
  // {
  //   {
  //     {
  //       showEmoji && (
  //         <div className="mt-2 z-50">
  //           <EmojiPicker
  //             onEmojiClick={(emoji) =>
  //               handleEmojiSelect({ native: emoji.emoji })
  //             }
  //             theme="light"
  //           />
  //         </div>
  //       );
  //     }
  //   }
  // }
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

  return (
    <div className="control-group">
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
          <Picker onSelect={handleEmojiSelect} theme="light" />
        </div>
      )}
    </div>
  );
}

export default () => {
  const editor = useEditor({
    extensions,
    content: "<p>Type your message here...</p>",
    editorProps: {
      attributes: {
        class: "text-editor",
      },
    },
  });
  return (
    <>
      <div className="editor-container">
        <TextEditor editor={editor} />
        <EditorContent editor={editor} />
        <AddOn />
      </div>
    </>
  );
};
