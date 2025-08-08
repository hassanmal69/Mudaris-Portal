import TextEditor from "@/components/textEditor";
import Messages from "./components/messages";

const Chat = () => {
  return (
    <section className="flex flex-col">
      <Messages />
      <TextEditor />
    </section>
  );
};

export default Chat;
