import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { postToSupabase } from "@/utils/crud/posttoSupabase";
import Toolbar from "./components/toolbar/Toolbar.jsx";
import MessageList from "./components/MessageList";
import { Send } from "lucide-react";

export default function TextEditor({ editor }) {
  const userId = useSelector((state) => state.auth.user?.id);
  const { workspace_id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageHTML = editor.getHTML();
    editor.commands.clearContent();

    const res = {
      workspace_id: workspace_id, // ensure this matches your schema
      sender_id: userId,
      content: messageHTML,
      reply_to: null,
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
        <Send className="text-[22px]" />
      </button>
    </div>
  );
}
