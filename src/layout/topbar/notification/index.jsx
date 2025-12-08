import { Bell } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.jsx";
import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { supabase } from "@/services/supabaseClient";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

export function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState([]);

  const { workspace_id } = useParams();
  const { session } = useSelector((state) => state.auth);

  const userId = session?.user?.id;
  const lastSeen = session?.user?.user_metadata?.last_notification_seen;

  const channelRef = useRef(null);


  // --- Compute unread notifications
  const computeUnread = useCallback(
    (list) => {
      const lastSeenMs = lastSeen ? new Date(lastSeen).getTime() : 0;
      return list.filter((n) => new Date(n.created_at).getTime() > lastSeenMs);
    },
    [lastSeen]
  );

  // --- Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!userId) return;

    let queryBuilder = supabase
      .from("notifications")
      .select(
        `
        id,
        description,
        created_at,
        type,
        "workspaceId",
        "channelId",
        "userId",
  workspaces:workspaceId(workspace_name)
        `
      ).eq("userId", userId)
      .eq("workspaceId", workspace_id)
      .order("created_at", { ascending: false });

  const { data, error } = await queryBuilder;

  if (!error && data) {
    setNotifications(data);
    setUnread(computeUnread(data));
  }
}, [userId, workspace_id, computeUnread]);

// --- Setup realtime subscription
const setupRealtime = useCallback(async () => {
  if (!userId) return;

  if (channelRef.current) supabase.removeChannel(channelRef.current);

  const filter = 
  `userId=eq.${userId},workspaceId=eq.${workspace_id}`;

  const channel = supabase
    .channel("notifications-realtime")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications", filter },
      (payload) => {
        setNotifications((prev) => {
          const updated = [payload.new, ...prev];
          if (lastSeen) setUnread(computeUnread(updated));
          return updated;
        });
      }
    )
    .subscribe();

  channelRef.current = channel;
}, [userId, workspace_id, lastSeen, computeUnread]);

// --- Initialize fetch + realtime
useEffect(() => {
  fetchNotifications();
  setupRealtime();

  return () => {
    if (channelRef.current) supabase.removeChannel(channelRef.current);
  };
}, [fetchNotifications, setupRealtime]);

// --- Mark notifications as seen
const handleOpenChange = async (open) => {
  if (!open) return;

  const now = new Date().toISOString();

  const { error } = await supabase.auth.updateUser({
    data: { last_notification_seen: now },
  });

  if (!error) setUnread([]);
};

// --- Memoized dropdown items
const notificationItems = useMemo(() => {
  if (notifications.length === 0) {
    return [<DropdownMenuItem key="none">No notifications</DropdownMenuItem>];
  }
  return notifications.map((n) => (
    <DropdownMenuItem key={n.id}>{n.description}</DropdownMenuItem>
  ));
}, [notifications]);

return (
  <DropdownMenu onOpenChange={handleOpenChange}>
    <DropdownMenuTrigger className="relative">
      <Bell className="h-6 w-6 text-(--primary-foreground)" />
      {unread.length > 0 && (
        <Badge className="absolute -top-2 -right-2 rounded-full px-2 py-0.5 text-(--foreground)">
          {unread.length}
        </Badge>
      )}
    </DropdownMenuTrigger>

    <DropdownMenuContent className="w-72 text-(--foreground)">
      {notificationItems}
    </DropdownMenuContent>
  </DropdownMenu>
);
}
