import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPinnedMessages } from "@/redux/features/messages/pin/pinSlice";
import { Pin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import MessageActions from "./messageActions/MessageActions";
import AllPinnedMessagesDialog from "./AllPinnedMessagesDialog";
const PinnedMessages = ({ channelId }) => {
  const dispatch = useDispatch();
  const pinnedState = useSelector((state) => state.pinnedMessages);
  const { items, loading } = pinnedState || {};
  useEffect(() => {
    if (!channelId) return
    dispatch(fetchPinnedMessages(channelId));
  }, [channelId, dispatch]);
  return (
    <>
      {items && items.length > 0 && (
        <section className="bg-(--accent)/50 p-4 rounded-lg space-y max-h-[300px] overflow-y-auto border-(--accent) mb-4.5">
          <h4 className=" text-xs text-(--accent-foreground)">
            Pinned Messages
          </h4>

          {loading ? (
            <Skeletor />
          ) : items && items.length > 0 ? (
            <>
              <div className="hover:bg-(--muted) p-2 group">
                <div className="flex flex-col gap-1 text-xs text-(--muted-foreground) mb-1 ">
                  <span className="flex items-center gap-1">
                    <Pin className="h-3 w-3" />
                    <p>Pinned message</p>
                  </span>

                  <div className="flex gap-2 relative">
                    <div className="absolute right-2 top-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-150 z-10">
                      <MessageActions
                        messageId={items[0].message_id}
                        userId={items[0].userId}
                        disableReply={true}
                      />
                    </div>
                    <Avatar className="h-10 w-10 mt-0.5">
                      <AvatarImage src={items[0]?.avatar_url} />
                      <AvatarFallback>
                        {items[0]?.full_name ||
                          "User"
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col ">
                      <div className="flex items-baseline gap-2">
                        <span className="text-(--foreground) text-[16px] font-medium">
                          {items[0]?.full_name || "Unknown User"}
                        </span>
                        <span className="text-xs text-(--muted-foreground)">
                          <LocalTime utcString={items[0]?.pinned_at} />
                        </span>
                      </div>

                      <div
                        key={items[0]?.id}
                        className="text-(--foreground) mt-1 whitespace-pre-wrap text-sm "
                        dangerouslySetInnerHTML={{
                          __html: items[0].content || "Loading...",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {items.length > 1 && (
                <div className="mt-2">
                  <AllPinnedMessagesDialog pinnedMessages={items} />
                </div>
              )}
            </>
          ) : null}
        </section>
      )}
    </>
  );
};

export default PinnedMessages;

const LocalTime = ({ utcString }) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const localTime = new Date(utcString).toLocaleTimeString("en-PK", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: userTimeZone,
  });

  return <span>{localTime.toUpperCase()}</span>;
};
const Skeletor = () => (
  <div className="space-y-3 mt-2">
    {[1, 2, 3].map((n) => (
      <div key={n} className="flex gap-2 items-start p-2">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 max-w-[30%] mb-2" />
          <Skeleton className="h-3 w-full" />
        </div>
      </div>
    ))}
  </div>
);
