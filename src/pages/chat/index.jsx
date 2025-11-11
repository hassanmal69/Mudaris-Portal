import Editor from "@/components/Editor";
import Messages from "./components/index";
import "./chat.css";
import VimeoPlayer from "@/services/vimeo/vimeoPlayer.jsx";

const Chat = () => {
  return (
    <section className="w-full bg--(--sidebar) m-2.5 responsive_chat_screen">
      <div className="absolute  inset-0 z-0 w-full h-full pointer-events-none" />
      <Messages />
      {/* <VimeoPlayer videoId="1134216199" /> */}
      <Editor toolbarStyles={{ width: "20px", height: "20px" }} />
    </section>
  );
}
export default Chat;
