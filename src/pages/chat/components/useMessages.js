import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import { addMessage, setMessages } from "@/features/messages/messageSlice";
import { openReplyDrawer } from "@/features/reply/replySlice";

const PAGE_SIZE = 20;

function groupReactions(reactions) {
  const grouped = {};
  reactions?.forEach((r) => {
    if (!grouped[r.reaction_type]) grouped[r.reaction_type] = [];
    grouped[r.reaction_type].push(r.user_id);
  });
  return grouped;
}

export default function useMessages() {
  const dispatch = useDispatch();
  const { groupId, user_id } = useParams();
  const messages = useSelector((state) => state.messages.items);
  const session = useSelector((state) => state.auth);
  const currentUserId = session.user?.id;
  const imageUrl = session.user?.user_metadata?.avatar_url;
  const fullName = session.user?.user_metadata?.fullName;
  const query = useSelector((state) => state.search.query);

  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [pickerOpenFor, setPickerOpenFor] = useState(null);
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
    let queryBuilder = supabase
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
          ),
          replies:messages!reply_to(id),
          reactions:message_reactions (
            id,
            user_id,
            reaction_type
          )
        `
      )
      .order("created_at", { ascending: false })
      .range(FROM, TO)
      .is("reply_to", null);

    if (user_id) {
      queryBuilder = queryBuilder.eq("token", user_id);
    } else {
      queryBuilder = queryBuilder.eq("channel_id", groupId);
    }

    const { data, error } = await queryBuilder;
    if (error) return [];
    const messagesWithReplyCount = data.map((msg) => ({
      ...msg,
      replyCount: msg.replies ? msg.replies.length : 0,
      reactions: msg.reactions || [],
    }));
    return messagesWithReplyCount.reverse();
  };

  useEffect(() => {
    (async () => {
      const firstBatch = await loadMessages(0);
      dispatch(setMessages(firstBatch));
      setPage(1);
      setTimeout(() => {
        containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }, 100);
    })();
  }, [groupId, user_id]);

  const loadOlder = useCallback(async () => {
    if (!hasMore) return;
    const container = containerRef.current;
    const oldScrollHeight = container.scrollHeight;
    const olderBatch = await loadMessages(page);
    if (olderBatch.length === 0) {
      setHasMore(false);
      return;
    }
    dispatch(setMessages([...olderBatch, ...messages]));
    setPage((p) => p + 1);
    setTimeout(() => {
      container.scrollTop = container.scrollHeight - oldScrollHeight;
    }, 50);
  }, [page, hasMore, messages]);

  useEffect(() => {
    if (!loaderRef.current) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadOlder();
      },
      { root: containerRef.current, threshold: 1.0 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadOlder]);

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
              profiles: { full_name: fullName, avatar_url: imageUrl },
              reactions: [],
            })
          );
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
    return () => supabase.removeChannel(subscription);
  }, [dispatch, fullName, imageUrl]);

  useEffect(() => {
    const subscription = supabase
      .channel("public:message_reactions")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "message_reactions" },
        async (payload) => {
          const affectedId = payload.new?.message_id || payload.old?.message_id;
          if (!affectedId) return;
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
                ),
                replies:messages!reply_to(id),
                reactions:message_reactions (
                  id,
                  user_id,
                  reaction_type
                )
              `
            )
            .eq("id", affectedId)
            .single();
          if (!error && data) {
            dispatch(
              setMessages(
                messages.map((msg) =>
                  msg.id === affectedId
                    ? { ...msg, reactions: data.reactions || [] }
                    : msg
                )
              )
            );
          }
        }
      )
      .subscribe();
    return () => supabase.removeChannel(subscription);
  }, [messages, dispatch]);

  const toggleReaction = async (messageId, emoji) => {
    const msg = messages.find((m) => m.id === messageId);
    const alreadyReacted = msg.reactions?.some(
      (r) => r.user_id === currentUserId && r.reaction_type === emoji
    );
    let updatedMessages;
    if (alreadyReacted) {
      await supabase
        .from("message_reactions")
        .delete()
        .eq("message_id", messageId)
        .eq("user_id", currentUserId)
        .eq("reaction_type", emoji);
      updatedMessages = messages.map((m) =>
        m.id === messageId
          ? {
              ...m,
              reactions: m.reactions.filter(
                (r) =>
                  !(r.user_id === currentUserId && r.reaction_type === emoji)
              ),
            }
          : m
      );
    } else {
      await supabase.from("message_reactions").upsert([
        {
          message_id: messageId,
          user_id: currentUserId,
          reaction_type: emoji,
        },
      ]);
      updatedMessages = messages.map((m) =>
        m.id === messageId
          ? {
              ...m,
              reactions: [
                ...m.reactions,
                {
                  user_id: currentUserId,
                  reaction_type: emoji,
                  id: "optimistic",
                },
              ],
            }
          : m
      );
    }
    dispatch(setMessages(updatedMessages));
    setPickerOpenFor(null);
  };

  return {
    messages: filtered,
    setMessages,
    loadOlder,
    hasMore,
    pickerOpenFor,
    setPickerOpenFor,
    toggleReaction,
    containerRef,
    loaderRef,
    currentUserId,
  };
}
