import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { postToSupabase } from "@/utils/crud/posttoSupabase";
import Toolbar from "./components/toolbar/Toolbar.jsx";
import MessageList from "./components/MessageList";

export default function TextEditor({ editor }) {
  const [msgArr, setMsgArr] = useState([]);
  const userId = useSelector((state) => state.auth.user?.id);
  const { workspace_id } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageHTML = editor.getHTML();
    setMsgArr((prev) => [...prev, messageHTML]);
    editor.commands.clearContent();

    const res = {
      workspace_id: workspace_id, // ensure this matches your schema
      sender_id: userId,
      content: messageHTML,
      reply_to: null,
    };

    const { data, error } = await postToSupabase("messages", res);
    if (error) console.error("Error adding message:", error.message);
    else console.log("Inserted message:", data);
  };

  return (
    <div className="control-group relative">
      <MessageList messages={msgArr} />
      <Toolbar editor={editor} />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
