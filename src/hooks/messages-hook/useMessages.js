import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import { addMessage, setMessages } from "@/features/messages/messageSlice";

const PAGE_SIZE = 20;

export default function useMessages() {
  const dispatch = useDispatch();
  const { groupId, user_id, token } = useParams();
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

  const profilesCache = useRef(new Map());
  const filtered = query
    ? messages.filter((msg) =>
      msg.content?.toLowerCase().includes(query.toLowerCase())
    )
    : messages;
  // 🔹 Load messages with sender profile

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
      queryBuilder = queryBuilder.eq("sender_id", user_id);
    } else if (token) {
      queryBuilder = queryBuilder.eq("token", token);

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

  // initial load
  useEffect(() => {
    (async () => {
      const firstBatch = await loadMessages(0);
      dispatch(setMessages(firstBatch));
      setPage(1);
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }, 100);
    })();
  }, [groupId, user_id, dispatch, token]);

  // load older
  const loadOlder = useCallback(async () => {
    if (!hasMore || !containerRef.current) return;
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
  }, [page, hasMore, messages, dispatch]);
  // infinite scroll observer
  useEffect(() => {
    if (!loaderRef.current || !containerRef.curr) return;
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
  // toggle reaction
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

  useEffect(() => {
    const handleInsert = async (payload) => {
      const newMsg = payload.new;
      let profile = null;

      if (newMsg.sender_id === currentUserId) {
        profile = {
          full_name: fullName,
          avatar_url: imageUrl,
        };
      } else {
        // ✅ check cache first
        if (profilesCache.current.has(newMsg.sender_id)) {
          profile = profilesCache.current.get(newMsg.sender_id);
        } else {
          const { data: p, error } = await supabase
            .from("profiles")
            .select("full_name, avatar_url")
            .eq("id", newMsg.sender_id)
            .single();

          if (!error && p) {
            profile = p;
            profilesCache.current.set(newMsg.sender_id, p);
          } else {
            profile = { full_name: "Unknown", avatar_url: null };
          }
        }
      }

      dispatch(
        addMessage({
          ...newMsg,
          profiles: profile,
          reactions: [],
        })
      );

      // auto-scroll if user is near bottom
      const container = containerRef.current;
      if (container) {
        const isAtBottom =
          container.scrollHeight - container.scrollTop <=
          container.clientHeight + 50;
        if (isAtBottom) {
          setTimeout(() => {
            container.scrollTop = container.scrollHeight;
          }, 50);
        }
      }
    };

    const subscription = supabase
      .channel("public:messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: groupId ? `channel_id=eq.${groupId}` : undefined,
        },
        handleInsert
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [dispatch, fullName, imageUrl, currentUserId, groupId]);

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
