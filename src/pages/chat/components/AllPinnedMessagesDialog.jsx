import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Pin } from "lucide-react";
import MessageActions from "./messageActions/MessageActions";

const AllPinnedMessagesDialog = ({ pinnedMessages }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-xs text-(--accent-foreground) hover:cursor-pointer hover:text-(--accent-foreground)/80"
        >
          See all pinned messages
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto text-(--foreground) border border-(--accent)/30 bg-(--background)">
        <DialogHeader>
          <DialogTitle>Pinned Messages</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {pinnedMessages?.map((m, _i) => (
            <div key={_i} className="hover:bg-(--muted) p-2 group rounded-sm">
              <div className="flex flex-col gap-1 text-xs text-(--muted-foreground) mb-1">
                <span className="flex items-center gap-1">
                  <Pin className="h-3 w-3" />
                  <p>Pinned message</p>
                </span>

                <div className="flex gap-2 relative">
                  <div className="absolute right-2 top-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity duration-150 z-10">
                    <MessageActions
                      messageId={m.message_id}
                      userId={m.userId}
                      disableReply={true}
                    />
                  </div>
                  <Avatar className="h-10 w-10 mt-0.5">
                    <AvatarImage src={m?.avatar_url} />
                    <AvatarFallback>
                      {m?.full_name ||
                        "User"
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <div className="flex items-baseline gap-2">
                      <span className="text-(--foreground) text-[16px] font-medium">
                        {m?.full_name || "Unknown User"}
                      </span>
                      <span className="text-xs text-(--muted-foreground)">
                        <LocalTime utcString={m?.pinned_at} />
                      </span>
                    </div>

                    <div
                      key={m?.id}
                      className="text-(--foreground) mt-1 whitespace-pre-wrap text-sm"
                      dangerouslySetInnerHTML={{
                        __html: m.content || "Loading...",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

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

export default AllPinnedMessagesDialog;
