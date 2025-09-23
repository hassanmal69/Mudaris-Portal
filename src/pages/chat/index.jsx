import Editor from "@/components/Editor.jsx";
import Messages from "./components/index.jsx";

const Chat = () => {
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
};

export default Chat;
