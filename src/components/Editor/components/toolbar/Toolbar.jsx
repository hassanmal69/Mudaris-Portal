import FileUploader from "@/pages/dashboard/components/fileInput";
import { toolbarButtons } from "../../config/toolbarButtons";
import EmojiButton from "../EmojiButton.jsx";
import MentionButton from "../MentionButton.jsx";
import AudioRecording from "@/pages/dashboard/components/audio";
import VideoRecording from "@/pages/dashboard/components/video";

export default function Toolbar({ editor }) {
  if (!editor) return null;

  return (
    <div className="toolbar">
      {toolbarButtons.map(({ name, icon: Icon, action, isActive, canRun }) => (
        <button
          key={name}
          onClick={() => action(editor)}
          disabled={canRun && !canRun(editor)}
          className={isActive && isActive(editor) ? "is-active" : ""}
          title={name}
        >
          <Icon className="w-5 h-5" />
        </button>
      ))}
      <EmojiButton editor={editor} />
      <MentionButton editor={editor} />
      <VideoRecording />
      <AudioRecording />
      <FileUploader/>
    </div>
  );
}
