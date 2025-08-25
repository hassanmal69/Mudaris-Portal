import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { postToSupabase } from "@/utils/crud/posttoSupabase";
import Toolbar from "./components/toolbar/Toolbar.jsx";
import { Send } from "lucide-react";

import { supabase } from "@/services/supabaseClient.js";

export default function TextEditor({ editor }) {
  const [msgArr, setMsgArr] = useState([]);
  const [publicUrl, setPublicUrl] = useState([]);
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
          console.log(m.filePath, m.file);
          const { error: uploadError } = await supabase.storage
            .from("media")
            .upload(m.filePath, m.file, { upsert: true });
          if (uploadError) {
            console.error("Error uploading file:", uploadError);
          } else {
            console.log(`File ${i} uploaded successfully!`);

            const { data } = supabase.storage
              .from("media")
              .getPublicUrl(m.filePath);

            console.log(" Public URL ", data.publicUrl);

            urls.push({
              fileType: m.fileType,
              fileUrl: data.publicUrl,
            });
          }
        } catch (err) {
          console.error("❌ Upload failed:", err);
        }
      }

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
    else console.log("Inserted message:", data);
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
