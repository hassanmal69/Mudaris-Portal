import ReplyDrawer from "./ReplyDrawer";
import MessageList from "./MessageList";
import useMessages from "../../../hooks/messages-hook/useMessages.js";
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
      <div className="relative ">
        <h1 className=" text-3xl text-white font-black">JS</h1>
        <p className="text-white">
          this channel is created by moiz. This is the very beginning of this
          channel
        </p>
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
