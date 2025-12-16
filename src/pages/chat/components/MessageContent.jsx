import React, { useState } from "react";

const MessageContent = ({ attachments = [], content, id }) => {
  const [previewSrc, setPreviewSrc] = useState(null);

  const attachment = attachments[0];
  console.count("object");
  return (
    <>
      {attachment?.fileType === "video" && (
        <video
          src={attachment.fileUrl}
          className="max-w-[220px] rounded-md"
          controls
        />
      )}

      {attachment?.fileType === "audio" && (
        <audio src={attachment.fileUrl} className="w-[220px]" controls />
      )}

      {attachment?.fileType?.startsWith("image") && (
        <img
          src={attachment.fileUrl}
          alt="Sent image"
          className="max-w-[120px] rounded-md cursor-pointer hover:opacity-90"
          onClick={() => setPreviewSrc(attachment.fileUrl)}
        />
      )}

      <div
        key={id}
        className="text-(--foreground) font-normal text-[16px] responsive_message_content"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      <ImagePreview src={previewSrc} onClose={() => setPreviewSrc(null)} />
    </>
  );
};

export default React.memo(MessageContent);
function ImagePreview({ src, onClose }) {
  if (!src) return null;

  return (
    <div
      className="fixed inset-0 z-999 flex items-center justify-center bg-black/70"
      onClick={onClose}
    >
      <img
        src={src}
        alt="Preview"
        className="max-h-[90vh] max-w-[90vw] rounded-md"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

React.memo(ImagePreview);
