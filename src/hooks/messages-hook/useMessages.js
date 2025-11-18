import React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import {
  addMessage,
  setMessages,
} from "@/redux/features/messages/messageSlice";
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
  // keep a ref to latest messages so callbacks/subscriptions can access up-to-date data
  const messagesRef = useRef(messages);
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  const filtered = React.useMemo(
    () =>
      query
        ? messages.filter((msg) =>
            msg.content?.toLowerCase().includes(query.toLowerCase())
          )
        : messages,
    [messages, query]
  );
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
          isForward,
          profiles (
            id,
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
    // use latest messages from ref to avoid stale closure and unnecessary deps
    dispatch(setMessages([...olderBatch, ...messagesRef.current]));
    setPage((p) => p + 1);
    setTimeout(() => {
      container.scrollTop = container.scrollHeight - oldScrollHeight;
    }, 50);
  }, [page, hasMore, messages, dispatch]);
  // infinite scroll observer
  useEffect(() => {
    if (!loaderRef.current || !containerRef.current) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadOlder();
      },
      { root: containerRef.current, threshold: 1.0 }
    );
    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loadOlder]);

  // listen for reaction changes and update the affected message using the latest messages (via ref)
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
                id,
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
                messagesRef.current.map((msg) =>
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
  }, [dispatch]);
  // toggle reaction
  const toggleReaction = useCallback(
    async (messageId, emoji) => {
      const msg = messagesRef.current.find((m) => m.id === messageId);
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
        updatedMessages = messagesRef.current.map((m) =>
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
        updatedMessages = messagesRef.current.map((m) =>
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
    },
    [currentUserId, dispatch]
  );

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

    const handleDelete = async (payload) => {
      const deletedId = payload.old?.id;
      if (!deletedId) return;
      // remove from local state
      dispatch(
        setMessages(messagesRef.current.filter((m) => m.id !== deletedId))
      );
    };

    const channel = supabase.channel("public:messages");

    channel
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
      .on(
        "postgres_changes",
        {
          event: "DELETE",
          schema: "public",
          table: "messages",
          filter: groupId ? `channel_id=eq.${groupId}` : undefined,
        },
        handleDelete
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [dispatch, fullName, imageUrl, currentUserId, groupId]);

  const forwardMsg = useCallback(
    async (groups, message) => {
      for (const e of groups) {
        const { error } = await supabase.from("messages").insert({
          channel_id: e.id,
          content: message.content,
          attachments: message.attachments,
          isForward: true,
          sender_id: currentUserId,
        });

        if (error) console.error("Insert error:", error);
      }

      console.log("forwarded message:", message.content, message.attachments);
    },
    [dispatch]
  );

  // delete a message (optimistic)
  const deleteMessage = useCallback(
    async (messageId) => {
      const previous = messagesRef.current;
      // optimistic remove
      dispatch(setMessages(previous.filter((m) => m.id !== messageId)));
      const { error } = await supabase
        .from("messages")
        .delete()
        .eq("id", messageId);
      if (error) {
        console.error("Failed to delete message", error);
        // revert
        dispatch(setMessages(previous));
      }
    },
    [dispatch]
  );

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
    deleteMessage,
    forwardMsg,
  };
}
