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
export default function EditorWrapper({ width, styles, toolbarStyles }) {
  const dispatch = useDispatch();
  const { workspace_id, groupId } = useParams();
  const { files } = useSelector((state) => state.file);
  const channel = useSelector((state) => state.channels.byId[groupId]);
  const channelName = channel?.channel_name || "";

  const editor = useEditor(
    {
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: `Write something in ${channelName}`,
        }),
        Mention.configure({
          HTMLAttributes: {
            class: "mention",
          },
          suggestion,
        }),
      ],
      workspaceId: workspace_id,
    },
    [channelName]
  );

  return (
    <div
      style={{
        width: width,
        ...styles,
      }}
      className={`editor-container w-full ${
        files.some(
          (f) => f.fileType.includes("image") || f.fileType.includes("pdf")
        )
          ? "editor-has-file"
          : ""
      }`}
    >
      <TextEditor editor={editor} toolbarStyles={toolbarStyles} />
      <EditorContent editor={editor} />
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
            <div className="relative">
              {/* PDF */}
              {f.fileType.includes("pdf") && (
                <embed
                  src={f.fileLink}
                  type="application/pdf"
                  className="w-25 h-25 rounded border"
                />
              )}

              {/* Audio */}
              {f.fileType === "audio" && (
                <audio src={f.fileLink} className="h-8" controls />
              )}

              {/* Image */}
              {f.fileType.startsWith("image") && (
                <div className="w-25 h-25 flex items-center justify-center overflow-hidden rounded border">
                  <img
                    src={f.fileLink}
                    alt={f.file.name}
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              )}

              {/* Remove Button */}
              <Button
                onClick={() => dispatch(removeValue(index))}
                className="text-(--destructive) absolute -top-2 -right-1
               rounded-full w-5 h-5 bg-(--destructive)/25"
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
{
  /* {f.fileType === "video" && (
              <video src={f.fileLink} width="200" controls />
            )} */
}
