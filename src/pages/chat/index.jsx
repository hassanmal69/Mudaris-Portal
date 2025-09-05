import Editor from "@/components/Editor";
import Messages from "./components/Messages";

const Chat = () => {
  return (
    <section className="flex flex-col bg-[#393E46]">
      <Messages />
      <Editor />
    </section>
  );
};

export default Chat;
