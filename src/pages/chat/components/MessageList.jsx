import MessageItem from "./MessageItem.jsx";

const MessageList = ({
  messages,
  currentUserId,
  toggleReaction,
  pickerOpenFor,
  setPickerOpenFor,
}) => (
  <>
    <h1 className="text-white">aaa</h1>

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
