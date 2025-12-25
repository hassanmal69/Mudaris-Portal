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
import { removeValue } from "@/redux/features/ui/fileSlice";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import useEditorActions from "./common";
import { useRef } from "react";

const CustomMention = Mention.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      color: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.color) return {};
          return {
            style: `background-color: ${attributes.color}20; color: ${attributes.color};`,
          };
        },
      },
    };
  },
});

export default function EditorWrapper({
  width,
  styles,
  toolbarStyles,
  placeholder,
}) {
  const dispatch = useDispatch();
  const { workspace_id, groupId } = useParams();
  const { files } = useSelector((state) => state.file);
  const channel = useSelector((state) => state.channels.byId[groupId]);
  const channelName = channel?.channel_name || "";
  const submitRef = useRef(null);

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: placeholder
            ? placeholder
            : `Write something in ${channelName}`,
        }),
        CustomMention.configure({
          suggestion,
        }),
      ],
      autofocus: false,
      workspaceId: workspace_id,
    },
    [channelName]
  );

  const { handleSubmit } = useEditorActions(editor);
  submitRef.current = handleSubmit;

  // -------------------------------
  //   ENTER → SUBMIT
  //   SHIFT+ENTER → NEW LINE
  // -------------------------------
  const handleKeyPress = (e) => {
    if (!editor) return;

    // Submit on Enter
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitRef.current && submitRef.current();
    }
  };

  return (
    <div
      style={{ width, ...styles }}
      className={`editor-container w-full ${
        files.some(
          (f) => f.fileType.includes("image") || f.fileType.includes("pdf")
        )
          ? "editor-has-file"
          : ""
      }`}
    >
      <TextEditor editor={editor} toolbarStyles={toolbarStyles} />

      {/*--- CONTENT EDITOR WITH KEYDOWN HANDLER ---*/}
      <EditorContent editor={editor} onKeyDown={handleKeyPress} />

      {/*--- FILES PREVIEW BELOW EDITOR ---*/}
      <div
        className={`${
          files.some(
            (f) => f.fileType.includes("image") || f.fileType.includes("pdf")
          )
            ? "file-map-container flex "
            : ""
        }`}
      >
        {files.map((f, index) => (
          <div key={index} className="file-map">
            <div className="relative w-fit">
              {f.fileType.includes("pdf") && (
                <embed
                  src={f.fileLink}
                  type="application/pdf"
                  className="w-25 h-25 rounded border"
                />
              )}

              {f.fileType === "audio" && (
                <audio src={f.fileLink} className="h-8" controls />
              )}

              {f.fileType.startsWith("image") && (
                <div className="w-25 h-25 flex items-center justify-center overflow-hidden rounded border">
                  <img
                    src={f.fileLink}
                    alt={f.file.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <Button
                onClick={() => dispatch(removeValue(index))}
                className="text-(--destructive) absolute -top-2 -right-1 rounded-full w-5 h-5 bg-(--destructive)/25"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
