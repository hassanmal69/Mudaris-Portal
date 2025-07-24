const { groupId } = useParams();
const { session } = useSelector((state) => state.auth);

const fetchMessages = async () => {
  try {
    const res = await axios.post("/api/chat/fetch", {
      groupId,
    });
    setMsg(res?.data?.data);
  } catch (error) {
    console.error(error);
  }
};

useEffect(() => {
  if (!groupId) return;
  fetchMessages();
  const channel = supabase
    .channel("message-channel")
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "message",
        filter: `channel_id=eq.${groupId}`,
      },
      (payload) => {
        const newMessage = payload.new;
        setMsg((prev) => [newMessage, ...prev]);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [groupId]);
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!newMsg.trim()) return setNewMsg("");
  setNewMsg("");
  try {
    await axios.post("/api/chat", {
      newMsg,
      groupId,
      senderEmail: session?.user?.email,
    });
  } catch (err) {
    console.error("Error sending message to backend", err);
  }
};

<button onClick={() => setVideoOption(!videoOption)}>Video Record</button>;
{
  videoOption && <Video />;
}

// onChange={(e) => setNewMsg(e.target.value)} --- IGNORE ---
// onSubmit={handleSubmit} --- IGNORE ---

<div className="flex flex-col-reverse text-black">
  {msg.map((m, idx) => (
    <div className="flex gap-2 mt-2" key={m.id || idx}>
      <p>{m.content}</p>
      <p>{m.sender_email}</p>
    </div>
  ))}
</div>;
