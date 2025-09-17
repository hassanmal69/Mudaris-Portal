import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import suggestion from "./components/toolbar/MentionComponent/suggestion";
import TextEditor from "./TextEditor";
import "./styles.scss";
import "./editor.css";
import { removeValue } from "@/features/ui/fileSlice";
export default function EditorWrapper({ width, styles, toolbarStyles }) {
  const dispatch = useDispatch();
  const { workspace_id } = useParams();
  const { files } = useSelector((state) => state.file);
  const { groupId } = useParams();
  const channel = useSelector((state) => state.channels.byId[groupId]);
  const channelName = channel?.channel_name;
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: `Write something in ${channelName}` }),
      Mention.configure({
        HTMLAttributes: {
          class:
            "mention"
        },
        suggestion,
      }),
    ],
    workspaceId: workspace_id,
  },
    [channelName]);

  return (
    <div
      style={{
        width: width,
        ...styles,
      }}
      className="editor-container "
    >
      <TextEditor editor={editor} toolbarStyles={toolbarStyles} />
      <EditorContent editor={editor} />
      {files.map((f, index) => (
        <div key={index} className="bg-gray-300">
          {f.fileType === "video" && (
            <video src={f.fileLink} width="200" controls />
          )}
          {f.fileType === "audio" && (
            <audio src={f.fileLink} width="200" controls />
          )}
          {f.fileType.startsWith("image") && (
            <img src={f.fileLink} alt={f.file.name} width="100" />
          )}
          <button onClick={() => dispatch(removeValue(index))}>
            ❌ Remove
          </button>
        </div>
      ))}
    </div>
  );
}
