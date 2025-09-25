import { Bell, ClockFading } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
export function Notifications() {
  const [notification, setNotification] = useState([]);
  const { workspace_id } = useParams();
  const { session } = useSelector((state) => state.auth);
  const lastSeen = session?.user?.user_metadata.last_notification_seen;
  const userId = session?.user?.id;
  const [unread, setUnread] = useState([]);
  const handleDB = async () => {
    const { data, error } = await supabase
      .from("notifications")
      .select(
        `
      id,
      description,
      created_at,
      workspaces (workspace_name)
    `
      )
      .eq("workspceId", workspace_id)
      .eq("userId", userId)
      .order("created_at", { ascending: false });
    if (error) {
      console.log("Error fetching:", error);
      return;
    }
    if (!error && data) {
      setNotification(data);
    }
  };
  const unreadLogic = (data) => {
    const unreadData = data.filter(
      (m) => new Date(m.created_at).getTime() > new Date(lastSeen).getTime()
    );
    setUnread(unreadData);
  };
  useEffect(() => {
    unreadLogic(notification);
  }, [notification, lastSeen]);
  // useEffect(() => {
  //   handleDB();
  //   const channel = supabase
  //     .channel("notifications-channel")
  //     .on(
  //       "postgres_changes",
  //       { event: "INSERT", schema: "public", table: "notifications" },
  //       (payload) => {
  //         setNotification((prev) => [payload.new, ...prev]); // prepend new
  //       }
  //     )

  //     .subscribe((status) => {
  //       if (status === "SUBSCRIBED") {
  //         console.log("Realtime connected ✅");
  //       } else if (status === "CHANNEL_ERROR") {
  //         console.error("Realtime connection error ❌");
  //       } else if (status === "CLOSED") {
  //         console.warn("Realtime connection closed ⚠️");
  //       }
  //     });

  //   // return () => {
  //   //   supabase.removeChannel(channel);
  //   // };
  // }, []);
  useEffect(() => {
    let channel; // to cleanup later

    const init = async () => {
      await handleDB(); // fetch existing notifications first

      channel = await new Promise((resolve, reject) => {
        const ch = supabase
          .channel("notifications-channel")
          .on(
            "postgres_changes",
            { event: "INSERT", schema: "public", table: "notifications" },
            (payload) => {
              setNotification((prev) => [payload.new, ...prev]);
            }
          )
          .subscribe((status) => {
            if (status === "SUBSCRIBED") {
              console.log("Realtime connected...");
              resolve(ch);
            } else if (status === "CHANNEL_ERROR") {
              console.error("Realtime error...");
              reject(new Error("Failed to subscribe"));
            } else if (status === "CLOSED") {
              console.warn("Realtime closed...");
            }
          });
      });
    };

    init();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
        console.log("Realtime unsubscribed 📴");
      }
    };
  }, []);

  const handleOpenChange = async (open) => {
    if (open) {
      let dateNow = new Date().toISOString();
      const { error } = await supabase.auth.updateUser({
        data: { last_notification_seen: dateNow },
      });
      if (error) {
        console.log("error cooming in updating a user lastseen", error);
      }
    }
  };

  return (
    <DropdownMenu onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger className="relative">
        <Bell className="h-6 w-6 text-[#eee]" />
        {unread.length > 0 && (
          <Badge className="absolute -top-2 -right-2 rounded-full px-2 py-0.5">
            {unread.length}
          </Badge>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64">
        {notification.length === 0 ? (
          <DropdownMenuItem>No notifications</DropdownMenuItem>
        ) : (
          notification.map((n) => (
            <DropdownMenuItem key={n.id}>{n.description}</DropdownMenuItem>
          ))
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
