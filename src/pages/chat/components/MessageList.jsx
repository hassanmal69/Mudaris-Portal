import { useParams } from "react-router-dom";
import MessageItem from "./MessageItem.jsx";
import PinnedMessages from "./PinnedMessages.jsx";
import { useSelector } from "react-redux";

const MessageList = ({
  messages,
  currentUserId,
  toggleReaction,
  pickerOpenFor,
  setPickerOpenFor,
  onDelete,
}) => {
  const { groupId } = useParams();
  return (
    <>
      <PinnedMessages channelId={groupId} msg={messages} />
      {messages.map((msg) => (
        <MessageItem
          key={msg.id}
          message={msg}
          currentUserId={currentUserId}
          toggleReaction={toggleReaction}
          pickerOpenFor={pickerOpenFor}
          setPickerOpenFor={setPickerOpenFor}
          onDelete={onDelete}
        />
      ))}
      {/* <div className="relative pt-[56.25%]">
      {" "}
        src="https://player.vimeo.com/video/1121743248?controls=1&badge=0&title=0&byline=0&portrait=0&autopause=0"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute top-0 left-0 w-full h-full"
        title="Lecture Video"
      ></iframe>
    </div>

    <script src="https://player.vimeo.com/api/player.js"></script> */}
    </>
  );
};

export default MessageList;
