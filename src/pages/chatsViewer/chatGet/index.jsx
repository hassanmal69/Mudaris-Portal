import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { supabase } from "@/services/supabaseClient";
import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

const PAGE_SIZE = 50;

const ChatGet = () => {
  const { token } = useParams();

  const [msgs, setMsgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchMessages = useCallback(
    async (isInitial = false) => {
      if (loading || (!isInitial && !hasMore)) return;
      setLoading(true);

      const start = isInitial ? 0 : msgs.length;
      const end = start + PAGE_SIZE - 1;

      const { data, error } = await supabase
        .from("messages")
        .select(
          `
     content,
     sender:profiles!messages_sender_id_fkey(
        full_name, avatar_url
     )
  `
        )
        .eq("token", token)
        .order("created_at", { ascending: true })
        .range(start, end);
      console.log("uaa data", data);
      if (error) {
        console.error("Supabase error:", error);
        setLoading(false);
        return;
      }

      if (isInitial) {
        setMsgs(data);
      } else {
        setMsgs((prev) => [...prev, ...data]);
      }

      if (!data?.length || data.length < PAGE_SIZE) {
        setHasMore(false);
      }

      setLoading(false);
    },
    [loading, hasMore, msgs.length, token]
  );

  useEffect(() => {
    setHasMore(true);
    fetchMessages(true);
  }, [token]);

  useEffect(() => {
    let timeout;
    const handleScroll = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (
          window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 150
        ) {
          fetchMessages(false);
        }
      }, 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchMessages]);

  return (
    <div className="text-(--accent-foreground) bg-(--background) min-h-screen p-4">
      <h1 className="text-xl mb-4 font-bold">ChatGet</h1>

      {msgs.length > 0 ? (
        msgs.map((m, i) => (
          <div className="flex gap-2.5  border-b border-(--border) py-2.5">
            <Avatar>
              <AvatarImage src={m.sender?.avatar_url} alter="image" />
            </Avatar>
            <div className="flex flex-col  gap-2">
              <p className="capitalize font-bold ">{m.sender?.full_name}</p>
              <div
                key={m.id || i}
                className="text-(--primary-foreground)"
                dangerouslySetInnerHTML={{ __html: m.content }}
              />
            </div>
          </div>
        ))
      ) : !loading ? (
        <p
          className="
          text-(--accent-foreground)
        "
        >
          No chats found.
        </p>
      ) : null}

      {loading && (
        <p className=" text-(--accent-foreground) mt-4">Loading more...</p>
      )}
    </div>
  );
};

export default ChatGet;
