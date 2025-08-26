import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { postToSupabase } from "@/utils/crud/posttoSupabase";
import Toolbar from "./components/toolbar/Toolbar.jsx";
import { Send } from "lucide-react";
import { addValue, clearValue } from "@/features/ui/fileSlice";
import { useDispatch } from "react-redux";

import { supabase } from "@/services/supabaseClient.js";

export default function TextEditor({ editor }) {
  const dispatch = useDispatch()
  const userId = useSelector((state) => state.auth.user?.id);
  const { groupId } = useParams();
  const { files } = useSelector((state) => state.file);
  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageHTML = editor.getHTML();
    editor.commands.clearContent();
    const urls = [];

    if (files && files.length > 0) {
      for (const [i, m] of files.entries()) {
        try {
          const { error: uploadError } = await supabase.storage
            .from("media")
            .upload(m.filePath, m.file, { upsert: true });
          if (uploadError) {
            console.error("Error uploading file:", uploadError);
            alert('can not upload your file sorry')
          } else {
            const { data } = supabase.storage
              .from("media")
              .getPublicUrl(m.filePath);

            urls.push({
              fileType: m.fileType,
              fileUrl: data.publicUrl,
            });
          }
        } catch (err) {
          console.error("❌ Upload failed:", err);
        }
      }
      dispatch(clearValue())
    }

    const res = {
      channel_id: groupId,
      sender_id: userId,
      content: messageHTML,
      reply_to: null,
      attachments: urls,
    };
    if (res.content === "<p></p>") return; // Prevent empty messages
    const { data, error } = await postToSupabase("messages", res);
    if (error) console.error("Error adding message:", error.message);
  };

  return (
    <div className="control-group relative">
      <Toolbar editor={editor} />
      <button className="kumar" onClick={handleSubmit}>
        <Send className="text-[42px] relative z-40" />
      </button>
    </div>
  );
}
