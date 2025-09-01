import FileUploader from "@/components/Editor/components/toolbar/files";
import { toolbarButtons } from "../../config/toolbarButtons";
import EmojiButton from "../EmojiButton.jsx";
import MentionButton from "../MentionButton.jsx";
import AudioRecording from "@/components/Editor/components/toolbar/audio";
import VideoRecording from "@/components/Editor/components/toolbar/video";

export default function Toolbar({ editor, toolbarStyles }) {
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
          <Icon style={toolbarStyles} />
        </button>
      ))}
      <EmojiButton editor={editor} toolbarStyles={toolbarStyles} />
      <MentionButton editor={editor} toolbarStyles={toolbarStyles} />
      <VideoRecording toolbarStyles={toolbarStyles} />
      <AudioRecording toolbarStyles={toolbarStyles} />
      <FileUploader toolbarStyles={toolbarStyles} />
    </div>
  );
}
