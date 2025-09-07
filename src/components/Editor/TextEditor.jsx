import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { postToSupabase } from "@/utils/crud/posttoSupabase";
import Toolbar from "./components/toolbar/Toolbar.jsx";
import { Send } from "lucide-react";
import { clearValue } from "@/features/ui/fileSlice";
import { useDispatch } from "react-redux";

import { supabase } from "@/services/supabaseClient.js";
import { useMemo } from "react";
export default function TextEditor({ editor, toolbarStyles }) {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.id);
  const displayName = useSelector((state) => state.auth.user?.user_metadata?.displayName);
  const { workspace_id, user_id, groupId } = useParams();
  const userRole = useSelector((state) => state.auth.user?.user_metadata?.user_role);
  const { files } = useSelector((state) => state.file);
  const channelState = useSelector((state) => state.channels);
  const channels = channelState.allIds.map((id) => ({
    id,
    name: channelState.byId[id]?.channel_name,
    visibility: channelState.byId[id]?.visibility,
  }));
  const desiredChannel = useMemo(() => {
    return channels.find((m) => m.id === groupId);
  }, [channels, groupId]);
  const replyMessage = useSelector((state) => state.reply.message);

  const handleNotificationforAdmin = async () => {
    if (replyMessage) {
      console.log("replysun", replyMessage);
      const { error } = await supabase.from("notifications")
        .insert({
          description: `${displayName} replied to your msg in ${desiredChannel.name} channel`,
          type: "reply",
          workspceId: workspace_id,
          channelId: groupId
        })
      if (error) {
        console.log(error);
      }
    }
    else if (userRole === "admin") {
      const { error } = await supabase.from("notifications")
        .insert({
          description: `admin ${displayName} added a new msg in ${desiredChannel.name} channel`,
          type: "adminMessage",
          workspceId: workspace_id,
          channelId: groupId
        })
      if (error) {
        console.log(error);
      }
    }
  }
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
            alert("can not upload your file sorry");
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
      dispatch(clearValue());
    }

    const res = {
      channel_id: groupId,
      sender_id: userId,
      content: messageHTML,
      reply_to: replyMessage ? replyMessage.id : null,
      attachments: urls,
      token: user_id
    };
    if (res.content === "<p></p>") return;
    const { data, error } = await postToSupabase("messages", res);
    await handleNotificationforAdmin();
    if (error) console.error("Error adding message:", error.message);
  };

  return (
    <div className="control-group relative">
      <Toolbar editor={editor} toolbarStyles={toolbarStyles} />
      <button className="kumar" onClick={handleSubmit}>
        <Send className="text-[42px] relative z-40" />
      </button>
    </div>
  );
}
