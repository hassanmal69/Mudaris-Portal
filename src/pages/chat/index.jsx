import Editor from "@/components/Editor";
import Messages from "./components/index";
import "./chat.css";
const Chat = () => {
  return (
    <section className="w-full m-2.5 responsive_chat_screen">
      <div
        className="absolute inset-0 z-0 w-full h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(125% 125% at 50% 10%, #000000 40%, #2b092b 100%)",
        }}
      />

      <Messages />
      <Editor toolbarStyles={{ width: "20px", height: "20px" }} />
    </section>
  );
};

export default Chat;
