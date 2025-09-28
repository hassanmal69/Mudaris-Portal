import Editor from "@/components/Editor";
import Messages from "./components/index";
import { useParams } from "react-router-dom";
import "./chat.css";

const Chat = () => {
  const { groupId, user_id } = useParams();
  if (groupId || user_id) {
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
  } else {
    return (
      <section>
        <div
          className="absolute flex items-center justify-center w-full h-full "
          style={{
            background:
              "radial-gradient(125% 125% at 50% 10%, #000000 40%, #2b092b 100%)",
          }}
        />
        <div
          className="
        relative flex items-center justify-center  w-[80vw] h-full 
        "
        >
          <h1 className="text-center font-bold  border  text-4xl p-3.5 rounded-2xl border-[#111] text-gray-400">
            Please create a group
          </h1>
        </div>

        <div />
      </section>
    );
  }
};
export default Chat;
