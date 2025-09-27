import Editor from "@/components/Editor";
import Messages from "./components/index";
import { useParams } from "react-router-dom";

const Chat = () => {
  const { groupId } = useParams();
  if (groupId) {
    return (
      <section>
        <div
          className="absolute inset-0 z-0 w-full h-full pointer-events-none"
          style={{
            background:
              "radial-gradient(125% 125% at 50% 10%, #000000 40%, #2b092b 100%)",
          }}
        />

        <Messages />

        <Editor
          width="1350px"
          toolbarStyles={{ width: "20px", height: "20px" }}
        />
      </section>
    );
  } else {
    return (
      <section>
        <div
          className="absolute flex items-center justify-center  w-full h-full "
          style={{
            background:
              "radial-gradient(125% 125% at 50% 10%, #000000 40%, #2b092b 100%)",
          }}
        />
        <h1 className="text-center absolute z-40 text-6xl font-bold text-white">Make a group first</h1>
        <div />
      </section>
    )
  }
};

export default Chat;
