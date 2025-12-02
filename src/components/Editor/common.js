import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
import { supabase } from "@/services/supabaseClient";
import { clearValue } from "@/redux/features/ui/fileSlice";
import { addToast } from "@/redux/features/toast/toastSlice";

export default function useEditorActions(editor) {
  const dispatch = useDispatch();
  const { workspace_id, groupId, token } = useParams();

  // Redux selectors
  const userId = useSelector((s) => s.auth.user?.id);
  const displayName = useSelector((s) => s.auth.user?.user_metadata?.fullName);
  const userRole = useSelector((s) => s.auth.user?.user_metadata?.user_role);
  const directChannel = useSelector((s) => s.direct.directChannel);
  const replyMessage = useSelector((s) => s.reply.message);
  const { files } = useSelector((s) => s.file);

  // store drafting
  useEffect(() => {
    if (!editor) return;

    const handler = () => {
      localStorage.setItem(`draft-${groupId}`, editor.getHTML());
    };

    editor.on("update", handler);
    return () => editor.off("update", handler);
  }, [editor, groupId]);

  // extract mention
  const extractMention = useCallback(function search(node) {
    if (!node) return { isMention: false, mentionedId: null };

    if (node.type === "mention") {
      return { isMention: true, mentionedId: node.attrs?.id };
    }

    if (Array.isArray(node.content)) {
      for (const child of node.content) {
        const found = search(child);
        if (found.isMention) return found;
      }
    }

    return { isMention: false, mentionedId: null };
  }, []);

  const checkMention = (json) => extractMention(json);

  // submit logic
  const handleSubmit = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (!editor) return;

    const messageHTML = editor.getHTML();
    const jsonVersion = editor.getJSON();

    const { isMention, mentionedId } = checkMention(jsonVersion);

    const isEmpty = messageHTML === "<p></p>";
    if (isEmpty && (!files || files.length === 0)) return;

    const isDirectMessage = window.location.pathname.includes("/individual/");

    editor.commands.clearContent();

    const urls = [];
    if (files && files.length > 0) {
      for (const file of files) {
        try {
          const { error } = await supabase.storage
            .from("media")
            .upload(file.filePath, file.file, { upsert: true });

          if (error) {
            dispatch(
              addToast({
                message: "Failed to upload file",
                type: "destructive",
                duration: 3000,
              })
            );
            continue;
          }

          const { data } = supabase.storage
            .from("media")
            .getPublicUrl(file.filePath);

          urls.push({
            fileType: file.fileType,
            fileUrl: data.publicUrl,
          });
        } catch (err) {
          console.log("❌ Upload failed", err);
        }
      }
      dispatch(clearValue());
    }

    const payload = {
      isDirectMessage,
      userId,
      recId: directChannel?.id ?? null,
      groupId,
      token,
      messageHTML,
      displayName,
      replyMessage,
      workspace_id,
      userRole,
      isMention,
      mentionPerson: mentionedId,
      urls,
    };

    await supabase.functions.invoke("message-sent", {
      body: JSON.stringify(payload),
    });
  };

  return {
    handleSubmit,
    checkMention,
    extractMention,
  };
}
