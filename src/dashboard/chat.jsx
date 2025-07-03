import { useEffect, useState } from "react"
import axios from "axios"
import { supabase } from "../supabaseClient.js"
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const Chat = () => {
  const [newMsg, setNewMsg] = useState("")
  const [msg, setMsg] = useState([])
  const { groupId } = useParams();
  console.log(groupId)
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("message")
      .select("message")
      .eq("groupId", groupId)
      .order("created_at", { ascending: false })

    if (!error) {
      setMsg(data)
    } else {
      console.error("Error fetching messages:", error)
    }
  }
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
          filter: `groupId=eq.${groupId}`
        },
        (payload) => {
          const newMessage = payload.new
          setMsg((prev) => [newMessage, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [groupId])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!newMsg.trim()) return
    setNewMsg("")
    try {
      await axios.post("/api/chat", {
        newMsg,
        groupId
      })
    } catch (err) {
      console.error("Error sending message to backend", err)
    }
  }

  return (
    <div className="border-2 w-full flex flex-col items-center justify-center">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newMsg}
          onChange={(e) => setNewMsg(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>

      <div className="flex flex-col-reverse">
        {msg.map((m, idx) => (
          <p key={m.id || idx} className="mt-3">
            {m.message}
          </p>
        ))}
      </div>
    </div>
  )
}

export default Chat
