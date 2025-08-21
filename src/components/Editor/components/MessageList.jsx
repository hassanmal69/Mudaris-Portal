export default function MessageList({ messages }) {
  return (
    <div>
      {messages.map((m, i) => (
        <div
          key={i}
          className="chat-message"
          dangerouslySetInnerHTML={{ __html: m }}
        />
      ))}
    </div>
  );
}
