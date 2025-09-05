import Editor from "@/components/Editor";
import Messages from "./components/index.jsx";

const Chat = () => {
  return (
    <section className="flex flex-col bg-[#393E46]">
      <Messages />
      <Editor
        width="1350px"
        toolbarStyles={{ width: "20px", height: "20px" }}
      />
    </section>
  );
};

export default Chat;
