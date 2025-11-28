import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { postToSupabase } from "@/utils/crud/posttoSupabase";
import Toolbar from "./components/toolbar/Toolbar.jsx";
import { Send } from "lucide-react";
import { clearValue } from "@/redux/features/ui/fileSlice.js";
import { useDispatch } from "react-redux";
import { supabase } from "@/services/supabaseClient.js";
import { useMemo, useState } from "react";
import HandleSupabaseLogicNotification from "@/layout/topbar/notification/handleSupabaseLogicNotification.jsx";
import { useEffect } from "react";
import { isAdmin } from "@/constants/constants.js";
export default function TextEditor({ editor, toolbarStyles }) {
  const dispatch = useDispatch();
  const [mentionedPerson, setMentionedPerson] = useState("");
  const userId = useSelector((state) => state.auth.user?.id);
  const displayName = useSelector(
    (state) => state.auth.user?.user_metadata?.fullName
  );
  const { workspace_id, groupId, token } = useParams();
  const userRole = useSelector(
    (state) => state.auth.user?.user_metadata?.user_role
  );
  const directChannel = useSelector((state) => state?.direct?.directChannel);
  const { files } = useSelector((state) => state.file);
  const channelState = useSelector((state) => state.channels);

  useEffect(() => {
    if (!editor) return;

    const savedDraft = localStorage.getItem(`draft`);
    if (savedDraft) {
      editor.commands.setContent(savedDraft);
    }

    editor.on("update", () => {
      const html = editor.getHTML();
      localStorage.setItem(`draft`, html);
    });

    return () => {
      editor.off("update");
    };
  }, [editor, groupId]);

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
      HandleSupabaseLogicNotification(
        "reply",
        workspace_id,
        groupId,
        null,
        `${displayName} replied to your message in ${desiredChannel.name} channel`
      );
    } else if (userRole === "admin") {
      HandleSupabaseLogicNotification(
        "adminMessage",
        workspace_id,
        groupId,
        null,
        `${displayName} admin added a message in ${desiredChannel.name} channel`
      );
    }
  };
  const checkMention = (json) => {
    var personID = json.content[0]?.content[0]?.attrs?.id;
    setMentionedPerson(personID);
    return JSON.stringify(json).includes('"mention"');
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageHTML = editor.getHTML();
    const jsonVersion = editor.getJSON();
    const isMention = checkMention(jsonVersion)
    if (messageHTML === "<p></p>" && (!files || files.length === 0)) return;
    // ✅ Detect if this is a direct message route
    const isDirectMessage = window.location.pathname.includes("/individual/");

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

    const recId = directChannel.id
    console.log('mention things just', isMention, mentionedPerson)
    let payload = {
      isDirectMessage,
      userId,
      recId,
      groupId,
      messageHTML,
      token,
      isMention,
      mentionedPerson,
      replyMessage,
      urls,
      userRole,
      workspace_id,
      displayName
    }
    const { data, error } = await supabase.functions.invoke('message-sent', {
      body: JSON.stringify(payload),
    })
    if (error) console.error('error coming when we send a message in edgefucntion', error)
    console.log(data)
  };

  return (
    <div className="control-group relative border-b border-(--border)">
      <Toolbar editor={editor} toolbarStyles={toolbarStyles} />
      <button
        className="kumar relative z-40
        transition-colors duration-300 delay-150
      "
        onClick={handleSubmit}
      >
        <Send
          className=" w-5 h-5 text-(--secondary-foreground) hover:text-(--success)
        transition-colors duration-300 delay-150
        "
        />
      </button>
    </div>
  );
}
