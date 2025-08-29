import React, { useEffect, useState } from "react";
import AddChannelDialog from "@/components/add-channel-dialog";
import InviteDialog from "@/components/invite-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  LockClosedIcon,
  GlobeAltIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useParams } from "react-router-dom";
import { getFromSupabase } from "@/utils/crud/getFromSupabase.js";
import { supabase } from "@/services/supabaseClient.js";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { postToSupabase } from "@/utils/crud/posttoSupabase";

const Sidebar = () => {
  const navigate = useNavigate();
  const { session } = useSelector((state) => state.auth);
  const [addChannelOpen, setAddChannelOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [channels, setChannels] = useState([]);
  const [workspaceName, setWorkspaceName] = useState("");
  const [users, setUsers] = useState([])
  const { workspace_id } = useParams();
  const { user_id } = useParams();
  const { groupId } = useParams();
  const fetchChannels = async () => {
    const res = await getFromSupabase(
      "channels",
      ["id", "channel_name", "visibility"],
      "workspace_id",
      workspace_id
    );
    if (res.data) {
      setChannels(
        res.data.map((channel) => ({
          id: channel.id,
          name: channel.channel_name,
          visibility: channel.visibility,
        }))
      );
    } else {
      console.error("Failed to fetch channels:", res.error);
    }
  };
  const getUsers = async () => {
    const { data, error } = await supabase
      .from("workspace_members")
      .select(`
   user_id,
    profiles (
      full_name,
      avatar_url
    )
  `)
    if (error) {
      console.log(error);
    }
    setUsers(data)
  }
  useEffect(() => {
    const fetchWorkspaceName = async () => {
      const { data } = await supabase
        .from("workspaces")
        .select("workspace_name")
        .eq("id", workspace_id)
        .single();
      if (data) setWorkspaceName(data.workspace_name);
    };
    fetchChannels();
    getUsers();
    fetchWorkspaceName();
  }, []);
  useEffect(() => {
    const subscription = supabase
      .channel("channels_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "channels" },
        (payload) => {
          setChannels((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);
  useEffect(() => {
    if (!groupId && !user_id && channels.length > 0) {
      const channelId = channels[0].id;
      navigate(`/workspace/${workspace_id}/group/${channelId}`);
    }
  }, [channels, groupId, navigate, workspace_id]);
  const handleIndividualMessage = async (u) => {
    const token = u?.user_id.slice(0, 6) + session?.user?.id.slice(0, 6)
    console.log(token);
    navigate(`/workspace/${workspace_id}/individual/${token}`)
    const res = {
      sender_id: session?.user?.id,
      receiver_id: u?.user_id,
      token,
    };
    const { data, error } = await postToSupabase("directMessagesChannel", res);
    if (error) console.log(error);
    console.log(data);
  }
  return (
    <>
      <AddChannelDialog
        open={addChannelOpen}
        onOpenChange={setAddChannelOpen}
        usedIn={"createChannel"}
      />
      <InviteDialog open={inviteOpen} onOpenChange={setInviteOpen} />
      <SidebarContent className="h-full px-2 py-4 flex flex-col gap-4">
        <SidebarHeader>
          <span className="text-lg font-bold tracking-tight">
            {workspaceName}
          </span>
        </SidebarHeader>
        <SidebarGroup>
          <SidebarGroupLabel>Channels</SidebarGroupLabel>
          <SidebarMenu>
            {channels.map((channel) => (
              <SidebarMenuItem key={channel.id}>
                <div className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer">
                  {channel.visibility === "private" ? (
                    <LockClosedIcon className="w-4 h-4 text-gray-400" />
                  ) : (
                    <GlobeAltIcon className="w-4 h-4 text-gray-400" />
                  )}
                  <Link to={`/workspace/${workspace_id}/group/${channel.id}`}>
                    <span className="font-medium text-sm text-gray-800">
                      {channel.name || channel.channel_name}
                    </span>
                  </Link>
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
          <Button
            variant="outline"
            size="sm"
            className="mt-2 w-full flex items-center gap-2 justify-center"
            onClick={() => setAddChannelOpen(true)}
          >
            <PlusIcon className="w-4 h-4" />
            Add Channel
          </Button>
        </SidebarGroup>
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel>Direct Messages</SidebarGroupLabel>
          <SidebarMenu>
            {users.map((user) => (
              <SidebarMenuItem key={user.id}>
                <div
                  onClick={() => handleIndividualMessage(user)}
                  className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer">
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={user.profiles.avatar_url} alt={user.full_name} />
                    {/* <AvatarFallback>{user.name[0]}</AvatarFallback> */}
                  </Avatar>
                  <span className="font-medium text-sm text-gray-800">
                    {user.profiles.full_name}
                  </span>
                  <span
                    className={`ml-auto w-2 h-2 rounded-full ${user.status === "online" ? "bg-green-500" : "bg-gray-400"
                      }`}
                    title={user.status}
                  ></span>
                </div>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
        <SidebarFooter className="mt-auto pb-2">
          <Button
            variant="default"
            size="sm"
            className="w-full bg-[#556cd6]"
            onClick={() => setInviteOpen(true)}
          >
            Invite Users
          </Button>
        </SidebarFooter>
      </SidebarContent>
    </>
  );
};

export default Sidebar;

// const users = [
//   {
//     id: 1,
//     name: "Alice",
//     avatar: "https://i.pravatar.cc/150?img=1",
//     status: "online",
//   },
//   {
//     id: 2,
//     name: "Bob",
//     avatar: "https://i.pravatar.cc/150?img=2",
//     status: "offline",
//   },
//   {
//     id: 3,
//     name: "Charlie",
//     avatar: "https://i.pravatar.cc/150?img=3",
//     status: "online",
//   },
//   {
//     id: 4,
//     name: "Dana",
//     avatar: "https://i.pravatar.cc/150?img=4",
//     status: "offline",
//   },
// ];
