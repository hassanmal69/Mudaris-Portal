// WorkspaceCard.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWorkspaceMembers,
  selectWorkspaceMembers,
  selectLoading,
} from "@/redux/features/workspaceMembers/WorkspaceMembersSlice.js";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar.jsx";
import { Button } from "@/components/ui/button.jsx";
import { supabase } from "@/services/supabaseClient.js"; // <-- add this import
import WorkspaceFallback from "@/components/ui/workspaceFallback";
import UserFallback from "@/components/ui/userFallback";

const WorkspaceCard = ({ workspace, index }) => {
  const dispatch = useDispatch();
  const members = useSelector(selectWorkspaceMembers(workspace.id));
  const membersLoading = useSelector(selectLoading(workspace.id));

  const [firstChannelId, setFirstChannelId] = useState(null);
  // const [channelLoading, setChannelLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchWorkspaceMembers(workspace.id));
  }, [dispatch, workspace.id]);

  useEffect(() => {
    let isMounted = true;
    const fetchFirstChannel = async () => {
      try {
        // select only id, ordered by created_at ascending, limit 1
        const { data, error } = await supabase
          .from("channels")
          .select("id")
          .eq("workspace_id", workspace.id)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle(); // returns null when no row instead of throwing

        if (error) {
          console.error("Error fetching first channel:", error);
        } else if (isMounted && data && data.id) {
          setFirstChannelId(data.id);
        }
      } catch (err) {
        console.error("fetchFirstChannel caught:", err);
      }
    };

    fetchFirstChannel();
    return () => {
      isMounted = false;
    };
  }, [workspace.id]);

  const launchTo = firstChannelId
    ? `/workspace/${workspace.id}/group/${firstChannelId}`
    : `/workspace/${workspace.id}`;

  return (
    <div className="flex w-full  sm:px-4 m-auto flex-col gap-3 sm:gap-0 sm:flex-row justify-between sm:items-center">
      <div className="flex gap-1.5 items-center">
        {workspace.avatar_url ? (
          <Avatar className="w-16 h-16 rounded-md">
            <AvatarImage
              src={workspace.avatar_url}
              alt={workspace.workspace_name}
            />
            <AvatarFallback>
              {workspace.workspace_name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        ) : (
          <WorkspaceFallback name={workspace.workspace_name} _idx={index} />
        )}

        <div className="flex flex-col gap-2">
          <p className="text-l font-medium capitalize text-(--primary-foreground)">
            {workspace.workspace_name}
          </p>

          <div className="flex gap-3 items-center">
            <div className="flex -space-x-4 rtl:space-x-reverse">
              {membersLoading ? (
                <p className="text-(--accent-foreground) text-sm">Loading...</p>
              ) : (
                members.slice(0, 3).map((m, idx) =>
                  m.user_profiles?.avatar_url ? (
                    <Avatar
                      key={m.user_id}
                      className="w-7 h-7 border-2 border-(--border) rounded-none"
                    >
                      <AvatarImage
                        src={m.user_profiles?.avatar_url}
                        alt={m.user_profiles?.full_name}
                      />
                    </Avatar>
                  ) : (
                    <UserFallback
                      name={m.user_profiles?.full_name}
                      _idx={idx}
                    />
                  )
                )
              )}
            </div>
            <p className="font-light text-(--primary-foreground) text-sm">
              {members.length} Members
            </p>
          </div>
        </div>
      </div>

      <Link
        className="flex justify-center"
        to={launchTo}
        style={{ textDecoration: "none" }}
      >
        <Button variant={"outline"}>Launch Workspace</Button>
      </Link>
    </div>
  );
};
export default WorkspaceCard;
