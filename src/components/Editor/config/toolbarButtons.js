// /editor/config/toolbarButtons.js
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

export const toolbarButtons = [
  {
    name: "bold",
    icon: BoldIcon,
    action: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor) => editor.isActive("bold"),
    canRun: (editor) => editor.can().chain().toggleBold().run(),
  },
  {
    name: "italic",
    icon: ItalicIcon,
    action: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor.isActive("italic"),
    canRun: (editor) => editor.can().chain().toggleItalic().run(),
  },
  {
    name: "strike",
    icon: StrikethroughIcon,
    action: (editor) => editor.chain().focus().toggleStrike().run(),
    isActive: (editor) => editor.isActive("strike"),
    canRun: (editor) => editor.can().chain().toggleStrike().run(),
  },
  // {
  //   name: "link",
  //   icon: LinkIcon,
  //   action: (editor) => {
  //     const url = prompt("Enter URL");
  //     if (url) {
  //       editor.chain().focus().setLink({ href: url }).run();
  //     }
  //   },
  //   isActive: (editor) => editor.isActive("link"),
  //   canRun: (editor) => editor.can().chain().setLink({ href: "" }).run(),
  // },
  // {
  //   name: "inlineCode",
  //   icon: CodeBracketSquareIcon,
  //   action: (editor) => editor.chain().focus().toggleCode().run(),
  //   isActive: (editor) => editor.isActive("code"),
  //   canRun: (editor) => editor.can().chain().toggleCode().run(),
  // },
  {
    name: "bulletList",
    icon: ListBulletIcon,
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
    isActive: (editor) => editor.isActive("bulletList"),
  },
  {
    name: "orderedList",
    icon: NumberedListIcon,
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive("orderedList"),
  },
  // {
  //   name: "codeBlock",
  //   icon: CodeBracketIcon,
  //   action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  //   isActive: (editor) => editor.isActive("codeBlock"),
  // },
  // {
  //   name: "blockquote",
  //   icon: ChatBubbleLeftEllipsisIcon,
  //   action: (editor) => editor.chain().focus().toggleBlockquote().run(),
  //   isActive: (editor) => editor.isActive("blockquote"),
  // },
];
