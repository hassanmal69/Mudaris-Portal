import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import suggestion from "./components/MentionComponent/suggestion";
import TextEditor from "./TextEditor";
import "./styles.scss";
import "./editor.css";
export default function EditorWrapper() {
  const { workspace_id } = useParams();
  const { file, fileType } = useSelector((state) => state.file);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: "Write something..." }),
      Mention.configure({ HtmlAttributes: { class: "mention" }, suggestion }),
    ],
    content: "",
    workspaceId: workspace_id,
  });

  return (
    <div className="editor-container">
      <TextEditor editor={editor} />
      {file && (
        <div className="mt-4">
          {fileType === "audio" && (
            <audio src={file} controls className="w-full" />
          )}
          {fileType === "image" && (
            <img src={file} alt="uploaded" className="max-w-sm rounded" />
          )}
          {fileType === "video" && (
            <video src={file} controls className="h-45 max-w-sm rounded" />
          )}
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
