import Editor from "@/components/Editor";
import Messages from "./components/Messages";

const Chat = () => {
  return (
    <section className="flex flex-col">
      <Messages />
      <Editor
        width="1350px"
        toolbarStyles={{ width: "20px", height: "20px" }}
      />
    </section>
  );
};

export default Chat;
