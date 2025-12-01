const MessageContent = ({ attachments, content, id }) => (
  <>
    {attachments?.[0]?.fileType === "video" && (
      <video src={attachments?.[0]?.fileUrl} width="200" controls />
    )}
    {attachments?.[0]?.fileType === "audio" && (
      <audio src={attachments?.[0]?.fileUrl} width="200" controls />
    )}
    {attachments?.[0]?.fileType?.startsWith("image") && (
      <img
        src={attachments?.[0]?.fileUrl}
        alt="error sending your image"
        width="100"
      />
    )}

    <div
      key={id}
      className="text-(--foreground) font-normal text-[16px] responsive_message_content "
      dangerouslySetInnerHTML={{ __html: content }}
    />
  </>
);

export default MessageContent;
