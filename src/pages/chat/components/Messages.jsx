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
  const session = useSelector((state) => state.auth);
  const imageUrl = session.user?.user_metadata?.avatar_url;
  const fullName = session.user?.user_metadata?.fullName;

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select(
          `
          id,
          content,
          created_at,
          profiles (
            full_name,
            avatar_url
          )
        `
        )
        .eq("workspace_id", workspace_id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        dispatch(setMessages(data));
      }
    };

    fetchMessages();
  }, [dispatch, workspace_id]);

  useEffect(() => {

    const subscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        (payload) => {

          dispatch(
            addMessage({
              ...payload.new,
              profiles: {
                full_name: fullName,
                avatar_url: imageUrl,
              },
            })
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [dispatch, fullName, imageUrl]);
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
            <strong>{m.profiles?.full_name || "Unknown User"}</strong>
            <div dangerouslySetInnerHTML={{ __html: m.content }} />
          </div>
        </div>
      ))}
    </section>
  );
};

export default Messages;
