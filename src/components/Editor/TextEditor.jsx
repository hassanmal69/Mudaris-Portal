import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Toolbar from "./components/toolbar/Toolbar.jsx";
import { Send } from "lucide-react";
import { clearValue } from "@/redux/features/ui/fileSlice.js";
import { useDispatch } from "react-redux";
import { supabase } from "@/services/supabaseClient.js";
import { useCallback, useEffect } from "react";
export default function TextEditor({ editor, toolbarStyles }) {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.user?.id);
  let mentionPerson
  const displayName = useSelector(
    (state) => state.auth.user?.user_metadata?.fullName
  );
  const { workspace_id, groupId, token } = useParams();
  const userRole = useSelector(
    (state) => state.auth.user?.user_metadata?.user_role
  );
  const directChannel = useSelector((state) => state?.direct?.directChannel);
  const { files } = useSelector((state) => state.file);
  useEffect(() => {
    if (!editor) return;

    const handler = () => {
      localStorage.setItem(`draft-${groupId}`, editor.getHTML());
    };

    editor.on("update", handler);

    return () => {
      editor.off("update", handler);
    };
  }, [editor, groupId]);

  const replyMessage = useSelector((state) => state.reply.message);

  const extractMention = useCallback((node) => {
    if (!node) return { isMention: false, mentionedId: null };

    // Check current node
    if (node.type === "mention") {
      return { isMention: true, mentionedId: node.attrs?.id };
    }

    // Recursively search children
    if (Array.isArray(node.content)) {
      for (const child of node.content) {
        const found = extractMention(child);
        if (found.isMention) return found;
      }
    }

    return { isMention: false, mentionedId: null };
  }, []);

  const checkMention = (json) => {
    const { isMention, mentionedId } = extractMention(json);
    mentionPerson = (mentionedId);
    return isMention;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const messageHTML = editor.getHTML();
    const jsonVersion = editor.getJSON();
    const isMention = checkMention(jsonVersion);
    if (messageHTML === "<p></p>" && (!files || files.length === 0)) return;
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
    let payload = {
      isDirectMessage,
      userId,
      recId: directChannel?.id ?? null,
      groupId,
      messageHTML,
      token,
      isMention,
      mentionPerson,
      replyMessage,
      urls,
      userRole,
      workspace_id,
      displayName,
    };
    const { data, error } = await supabase.functions.invoke("message-sent", {
      body: JSON.stringify(payload),
    });
    if (error)
      console.error(
        "error coming when we send a message in edgefucntion",
        error
      );
    console.log(data);
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
