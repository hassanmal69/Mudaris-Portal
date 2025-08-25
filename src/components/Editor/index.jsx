import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import suggestion from "./components/MentionComponent/suggestion";
import TextEditor from "./TextEditor";
import "./styles.scss";
import "./editor.css";
import { removeValue } from "@/features/ui/fileSlice";
export default function EditorWrapper() {
  const dispatch = useDispatch()
  const { workspace_id } = useParams();
  const { files } = useSelector((state) => state.file);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Write something..." }),
      Mention.configure({ HtmlAttributes: { class: "mention" }, suggestion }),
    ],
    workspaceId: workspace_id,
  });

  return (
    <div className="editor-container">
      <TextEditor editor={editor} />
      {files.map((f, index) => (
        <div key={index}>
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
      {/* {files && (
        <div className="mt-4">
          {fileType === "audio" && (
            <audio src={fileLink} controls className="w-full" />
          )}
          {fileType === "image" && (
            <img src={fileLink} alt="uploaded" className="max-w-sm rounded" />
          )}
          {fileType === "video" && (
            <video src={fileLink} controls className="h-45 max-w-sm rounded" />
          )}
        </div>
      )} */}
      <EditorContent editor={editor} />
    </div>
  );
}
