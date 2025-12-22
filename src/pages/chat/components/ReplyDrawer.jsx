import { useEffect, useRef, useState } from "react";
import { Drawer } from "vaul";
import { useDispatch, useSelector } from "react-redux";
import { closeReplyDrawer } from "@/redux/features/reply/replySlice.js";
import { supabase } from "@/services/supabaseClient";
import Editor from "@/components/Editor/index.jsx";
import { isRTL } from "@/utils/rtl/rtl";
import { Button } from "@/components/ui/button";
import UserFallback from "@/components/ui/userFallback";

export default function ReplyDrawer() {
  const dispatch = useDispatch();
  const { open, message } = useSelector((state) => state.reply);
  const [replies, setReplies] = useState([]);
  const randomIdRef = useRef(Math.floor(Math.random() * 100));

  useEffect(() => {
    if (!message) return;

    const fetchReplies = async () => {
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
        .eq("reply_to", message.id)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching replies:", error);
        return;
      }
      setReplies(data);
    };

    fetchReplies();

    // 🔴 optional: realtime subscription for new replies
    const subscription = supabase
      .channel("reply-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `reply_to=eq.${message.id}`,
        },
        (payload) => {
          setReplies((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [message?.id]);

  if (!open || !message) return null;
  const rtl = isRTL(message?.content);
  const avatarUrl = message?.profiles?.avatar_url
  return (
    <Drawer.Root
      open={open}
      direction="right"
      modal={true}
      onClose={() => dispatch(closeReplyDrawer())}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-(--card)" />
        <Drawer.Content
          className={`top-2 bottom-2 reply-container fixed z-10 outline-none w-137.5 flex right-1 `}
          style={{ "--initial-transform": "calc(100% + 8px)" }}
          dir={rtl ? "rtl" : "ltr"}
        >
          <div
            className={`bg-(--card) h-full w-full p-5 flex text-(--card-foreground) flex-col rounded ${rtl ? "text-right" : "text-left"
              }`}
          >
            {/* Parent message */}
            <Drawer.Title
              className="
            text-left
            text-[18px] font-bold mb-4"
            >
              Reply to Message
            </Drawer.Title>
            <div className="mb-4 border-b border-(--chart-1) pb-4">
              <div className="flex items-center gap-2">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="profileImg"
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <UserFallback
                    name={message.profiles?.full_name}
                    _idx={randomIdRef.current}
                    cn={"w-10 h-10 rounded-full"}
                    avatarCn={"text-lg font-bold"}
                  />
                )}
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {message.profiles?.full_name || "Unknown User"}
                  </span>

                  <div
                    className={`mt-2 text-sm  ${rtl ? "text-right" : "text-left"}`}
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  />
                </div>
              </div>
            </div>

            {/* Replies list */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {replies.map((reply) => (
                <div
                  key={reply.id}
                  className={`flex items-center ${rtl ? "flex-row text-right" : ""
                    }`}
                >
                  {reply.profiles?.avatar_url ? (
                    <img
                      src={reply.profiles?.avatar_url}
                      alt="profileImg"
                      className="w-8 h-8 rounded"

                    />
                  ) : (
                    <UserFallback
                      name={reply.profiles?.full_name}
                      _idx={randomIdRef.current}
                      className="w-8 h-8 rounded"
                      avatarCn={"text-lg font-bold"}
                    />
                  )}
                  <div className=" p-2 rounded-lg">
                    <span className="font-medium text-sm">
                      {reply.profiles?.full_name}
                    </span>

                    <div
                      className={`text-sm  ${rtl ? "text-right" : "text-left"}`}
                      dangerouslySetInnerHTML={{ __html: reply.content }}
                    />
                  </div>
                </div>
              ))}
              {replies.length === 0 && (
                <p className="text-sm text-gray-400">No replies yet</p>
              )}
            </div>

            {/* Reply input */}
            <div className="w-full max-w-4xl">
              <Editor
                placeholder="Write your reply"
                toolbarStyles={{ width: "12px", height: "12px" }}
              />
            </div>

            <Button
              className="mt-4 "
              variant={"destructive"}
              onClick={() => dispatch(closeReplyDrawer())}
            >
              Close
            </Button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
