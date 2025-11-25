import { useParams } from "react-router-dom";
import MessageItem from "./MessageItem.jsx";
import PinnedMessages from "./PinnedMessages.jsx";
import { isRTL } from "@/utils/rtl/rtl.js";

const MessageList = ({
  messages,
  currentUserId,
  toggleReaction,
  pickerOpenFor,
  setPickerOpenFor,
  onDelete,
  forwardMsg,
}) => {
  const { groupId } = useParams();

  return (
    <>
      <PinnedMessages channelId={groupId} msg={messages} />
      {messages.map((msg) => {
        const rtl = isRTL(msg?.content);
        return (
          <div
            key={msg.id}
            className={`my-2 px-3 py-2 rounded-xl  ${
              rtl ? "text-right" : "text-left"
            }`}
            dir={rtl ? "rtl" : "ltr"}
          >
            <MessageItem
              rtl={rtl}
              message={msg}
              currentUserId={currentUserId}
              toggleReaction={toggleReaction}
              pickerOpenFor={pickerOpenFor}
              setPickerOpenFor={setPickerOpenFor}
              onDelete={onDelete}
              forwardMsg={forwardMsg}
            />
          </div>
        );
      })}
    </>
  );
};

export default MessageList;
