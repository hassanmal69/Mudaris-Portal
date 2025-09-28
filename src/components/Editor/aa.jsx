// const handleSubmit = async (e) => {
//   e.preventDefault();
//   const messageHTML = editor.getHTML();
//   const jsonVersion = editor.getJSON();
//   if (checkMention(jsonVersion)) {
//     HandleSupabaseLogicNotification(
//       "mention",
//       workspace_id,
//       groupId,
//       mentionedPerson,
//       `${displayName} mentioned you in ${desiredChannel?.name}`
//     );
//   }
//   editor.commands.clearContent();
//   const urls = [];

//   if (files && files.length > 0) {
//     for (const [i, m] of files.entries()) {
//       try {
//         const { error: uploadError } = await supabase.storage
//           .from("media")
//           .upload(m.filePath, m.file, { upsert: true });
//         if (uploadError) {
//           console.error("Error uploading file:", uploadError);
//           alert("can not upload your file sorry");
//         } else {
//           const { data } = supabase.storage
//             .from("media")
//             .getPublicUrl(m.filePath);

//           urls.push({
//             fileType: m.fileType,
//             fileUrl: data.publicUrl,
//           });
//         }
//       } catch (err) {
//         console.error("❌ Upload failed:", err);
//       }
//     }
//     dispatch(clearValue());
//   }

//   const res = {
//     channel_id: groupId,
//     sender_id: userId,
//     content: messageHTML,
//     reply_to: replyMessage ? replyMessage.id : null,
//     attachments: urls,
//     token: user_id,
//   };
//   if (res.content === "<p></p>") return;
//   const { error } = await postToSupabase("messages", res);
//   await handleNotificationforAdmin();
//   if (error) console.error("Error adding message:", error.message);
// };
