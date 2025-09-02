import MessageItem from "./MessageItem";

const MessageList = ({
  messages,
  currentUserId,
  toggleReaction,
  pickerOpenFor,
  setPickerOpenFor,
}) => (
  <>
    {messages.map((msg) => (
      <MessageItem
        key={msg.id}
        message={msg}
        currentUserId={currentUserId}
        toggleReaction={toggleReaction}
        pickerOpenFor={pickerOpenFor}
        setPickerOpenFor={setPickerOpenFor}
      />
    ))}
  </>
);

export default MessageList;