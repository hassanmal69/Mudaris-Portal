import ReplyDrawer from "./ReplyDrawer";
import MessageList from "./MessageList";
import useMessages from "./useMessages";
import "./message.css";

const Messages = () => {
  const {
    messages,
    currentUserId,
    toggleReaction,
    pickerOpenFor,
    setPickerOpenFor,
    containerRef,
    loaderRef,
    hasMore,
  } = useMessages();

  return (
    <section ref={containerRef} className="messages-container">
      <ReplyDrawer />
      <div ref={loaderRef}>
        {hasMore ? "loading older messages" : "No more messages"}
      </div>
      <MessageList
        messages={messages}
        currentUserId={currentUserId}
        toggleReaction={toggleReaction}
        pickerOpenFor={pickerOpenFor}
        setPickerOpenFor={setPickerOpenFor}
      />
    </section>
  );
};

export default Messages;