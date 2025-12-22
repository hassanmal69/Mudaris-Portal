import Editor from "@/components/Editor/index.jsx";
import Messages from "./components/index.jsx";
import "./chat.css";

const Chat = () => {
  return (
    <section className="w-full h-screen mx-2.5 responsive_chat_screen">
      <div className="absolute  inset-0 z-0 w-full h-full pointer-events-none" />
      <Messages />
      <Editor toolbarStyles={{ width: "20px", height: "20px" }} />
    </section>
  );
};
export default Chat;
