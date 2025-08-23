import React, { useEffect } from "react";
import { supabase } from "@/services/supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setMessages } from "@/features/messages/messageSlice";
import { useParams } from "react-router-dom";
import "./message.css";
const Messages = () => {
  const dispatch = useDispatch();
  const { workspace_id } = useParams();
  const messages = useSelector((state) => state.messages.items);

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(
          ` id,
    content,
    created_at,
    profiles (
      full_name,
      avatar_url
    )
  `
        )
        .eq("workspace_id", workspace_id) // ✅ filter for correct workspace
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        dispatch(setMessages(data));
      }
    };

    fetchMessages();

    // ✅ Subscribe for realtime inserts
    const subscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {
          dispatch(addMessage(payload.new));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [dispatch, workspace_id]);

  console.log("messages", messages);

  return (
    <section className="messages-container">
      {messages.map((m) => (
        <>
          <div key={m.id} className="flex gap-2">
            <img
              src={m.profiles?.avatar_url}
              alt={m.profiles?.full_name}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <strong className="text-[#556cd6]">
                {m.profiles?.full_name || "error"}
              </strong>
              <div dangerouslySetInnerHTML={{ __html: m.content }} />
            </div>
          </div>
        </>
      ))}
    </section>
  );
};

export default Messages;
