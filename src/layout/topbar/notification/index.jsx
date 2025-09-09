import { Bell, ClockFading } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
export function Notifications() {
    const [notification, setNotification] = useState([])
    const { workspace_id } = useParams();
    const { session } = useSelector((state) => state.auth);
    const lastSeen = session?.user?.user_metadata.last_notification_seen
    const userId = session?.user?.id
    const [unread, setUnread] = useState([])
    const handleDB = async () => {
        const { data, error } = await supabase
            .from("notifications")
            .select(`
      id,
      description,
      created_at,
      workspaces (workspace_name)
    `)
            .eq("workspceId", workspace_id)
            .eq("userId",userId)
            .order("created_at", { ascending: false })
        if (error) {
            console.log("Error fetching:", error);
            return;
        }
        if (!error && data) {
            console.log('checking data in notification', data);
            setNotification(data);
        }
    };
    const unreadLogic = (data) => {
        console.log("all created_at:", data.map(d => d.created_at));
        const unreadData = data.filter((m) => new Date(m.created_at).getTime() > new Date(lastSeen).getTime());
        setUnread(unreadData)
        console.log("unread count:", unreadData.length, unreadData);
    }
    useEffect(() => {
        unreadLogic(notification)
    }, [notification, lastSeen])
    useEffect(() => {
        handleDB();
        const channel = supabase
            .channel("notifications-channel")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "notifications" },
                (payload) => {
                    console.log("New notification:", payload.new);
                    setNotification((prev) => [payload.new, ...prev]); // prepend new
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleOpenChange = async (open) => {
        if (open) {
            let dateNow = new Date().toISOString();;
            const { error } = await supabase.auth.updateUser({
                data: { last_notification_seen: dateNow }
            })
            if (error) {
                console.log('error cooming in updating a user lastseen', error);
            }
        }
    }

    return (
        <DropdownMenu onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger className="relative">

                <Bell className="h-6 w-6" />
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
    )
}
