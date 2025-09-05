import { Bell } from "lucide-react"
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
export function Notifications() {
    const [notification, setNotification] = useState([])
    const { session } = useSelector((state) => state.auth);
    const lastSeen = session?.user?.user_metadata.last_notification_seen
    const [unread, setUnread] = useState([])
    const handleDB = async () => {
        const { data, error } = await supabase
            .from("notifications")
            .select(`
      id,
      description,
      created_at,
      workspaces (workspace_name)
    `);

        if (error) {
            console.log("Error fetching:", error);
            return;
        }

        setNotification(data);

        console.log("lastSeen:", lastSeen);
        console.log("all created_at:", data.map(d => d.created_at));

        const unread = data.filter((m) => new Date(m.created_at) > new Date(lastSeen));

        console.log("unread count:", unread.length, unread);
    };

    useEffect(() => {
        handleDB();

        const channel = supabase
            .channel("realtime:notifications")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "notifications" },
                (payload) => {
                    setNotification((prev) => [...prev, payload.new]);
                }
            )
            .subscribe();

        // cleanup
        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    //in unread only there will be notification in which 
    // isread is false
    // const unread = notification.filter(n => !n.is_read)

    const handleOpenChange = async (open) => {
        if (open) {
            setNotification((prev) =>
                prev.map((n) => ({ ...n, is_read: true }))
            )
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
