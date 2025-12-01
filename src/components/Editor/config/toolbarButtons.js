// /editor/config/toolbarButtons.js
import {
  BoldIcon,
  ItalicIcon,
  StrikethroughIcon,
  ListBulletIcon,
  NumberedListIcon,
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
];
