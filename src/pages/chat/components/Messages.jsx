import React, { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, setMessages } from "@/features/messages/messageSlice";
import { useParams } from "react-router-dom";
import "./message.css";
const PAGE_SIZE = 20;
const Messages = () => {
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const messages = useSelector((state) => state.messages.items);
  const session = useSelector((state) => state.auth);
  const query = useSelector((state) => state.search.query);
  const imageUrl = session.user?.user_metadata?.avatar_url;
  const fullName = session.user?.user_metadata?.fullName;

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const containerRef = useRef(null);
  const loaderRef = useRef(null);
  const filtered = query
    ? messages.filter((msg) =>
        msg.content?.toLowerCase().includes(query.toLowerCase())
      )
    : messages;

  const loadMessages = async (pageNum) => {
    const FROM = pageNum * PAGE_SIZE;
    const TO = FROM + PAGE_SIZE - 1;
    const { data, error } = await supabase
      .from("messages")
      .select(
        `
          id,
          content,
          attachments,
          created_at,
          profiles (
            full_name,
            avatar_url
          )
        `
      )
      .eq("channel_id", groupId)
      .order("created_at", { ascending: false })
      .range(FROM, TO);

    if (error) {
      console.error("Error fetching messages:", error);
      return [];
    }

    // reverse so oldest at top -> newest at bottom
    return data.reverse();
  };

  // inital load -> latest messages
  useEffect(() => {
    (async () => {
      const firstBatch = await loadMessages(0);
      dispatch(setMessages(firstBatch));
      setPage(1);

      setTimeout(() => {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }, 100);
    })();
  }, [groupId]);

  // load older messages when top reached

  const loadOlder = useCallback(async () => {
    if (!hasMore) return;

    const container = containerRef.current;
    const oldScrollHeight = container.scrollHeight;

    const olderBatch = await loadMessages(page);
    if (olderBatch.length === 0) {
      setHasMore(false);
      return;
    }

    // prepend older messages

    dispatch(setMessages([...olderBatch, ...messages]));
    setPage((p) => p + 1);

    // maintain scroll position
    setTimeout(() => {
      container.scrollTop = container.scrollHeight - oldScrollHeight;
    }, 50);
  }, [page, hasMore, messages]);

  // observer to detect when user scrolls to top
  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadOlder();
        }
      },
      {
        root: containerRef.current,
        threshold: 1.0,
      }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadOlder]);
  // realtime subscription for new messages
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
          // auto scroll if at bottom

          const container = containerRef.current;
          const isAtBottom =
            container.scrollHeight - container.scrollTop <=
            container.clientHeight + 50;

          if (isAtBottom) {
            setTimeout(() => {
              container.scrollTop = container.scrollHeight;
            }, 50);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [dispatch, fullName, imageUrl]);
  return (
    <section ref={containerRef} className="messages-container">
      <div ref={loaderRef}>
        {hasMore ? "loading older messages" : "No more messages"}
      </div>
      {filtered.map((m) => (
        <div key={m.id} className="flex gap-2">
          <img
            src={m.profiles?.avatar_url}
            alt={m.profiles?.full_name}
            className="w-8 h-8 rounded-full"
          />
          <div className="message-body">
            <strong>{m.profiles?.full_name || "Unknown User"}</strong>
            <div dangerouslySetInnerHTML={{ __html: m.content }} />
            {m?.attachments?.[0]?.fileType === "video" && (
              <video src={m?.attachments?.[0]?.fileUrl} width="200" controls />
            )}
            {m?.attachments?.[0]?.fileType === "audio" && (
              <audio src={m?.attachments?.[0]?.fileUrl} width="200" controls />
            )}

            {m?.attachments?.[0]?.fileType.startsWith("image") && (
              <img
                src={m?.attachments?.[0]?.fileUrl}
                alt="error sending your image"
                width="100"
              />
            )}
          </div>
        </div>
      ))}
    </section>
  );
};

export default Messages;
