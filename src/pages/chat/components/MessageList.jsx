import { useParams } from "react-router-dom";
import MessageItem from "./MessageItem.jsx";
import PinnedMessages from "./PinnedMessages.jsx";

const MessageList = ({
  messages,
  currentUserId,
  toggleReaction,
  pickerOpenFor,
  setPickerOpenFor,
  onDelete,
  forwardMsg
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
          forwardMsg={forwardMsg}
        />
      ))}
    </>
  );
};

export default MessageList;
