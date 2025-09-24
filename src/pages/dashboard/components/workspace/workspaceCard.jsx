import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchWorkspaceMembers,
  selectWorkspaceMembers,
  selectLoading,
} from "@/features/workspaceMembers/WorkspaceMembersSlice.js";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar.jsx";
import { Button } from "@/components/ui/button.jsx";

// 6 fallback colors
const fallbackColors = [
  "bg-rose-200",
  "bg-sky-200",
  "bg-emerald-200",
  "bg-amber-200",
  "bg-violet-200",
  "bg-fuchsia-200",
];

const WorkspaceCard = ({ workspace, index }) => {
  const dispatch = useDispatch();
  const members = useSelector(selectWorkspaceMembers(workspace.id));
  const membersLoading = useSelector(selectLoading(workspace.id));

  useEffect(() => {
    dispatch(fetchWorkspaceMembers(workspace.id));
  }, [dispatch, workspace.id]);

  // Helper: Workspace fallback avatar
  const getWorkspaceFallback = (name, idx) => {
    const color = fallbackColors[idx % fallbackColors.length];
    return (
      <Avatar
        className={`w-16 h-16 rounded-sm  flex items-center justify-center`}
      >
        <AvatarFallback
          className={`text-[#222] ${color} rounded-none text-xl font-bold`}
        >
          {name?.[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  };

  // Helper: Member fallback avatar
  const getMemberFallback = (name, idx) => {
    const color = fallbackColors[idx % fallbackColors.length];
    return (
      <Avatar
        key={name + idx}
        className={`w-7 h-7 border-2 border-white rounded-sm  flex items-center justify-center`}
      >
        <AvatarFallback
          className={`text-[#222] text-sm rounded-none ${color} font-semibold`}
        >
          {name?.[0]?.toUpperCase()}
        </AvatarFallback>
      </Avatar>
    );
  };

  return (
    <div className="flex w-full sm:px-4 m-auto flex-col gap-3 sm:gap-0 sm:flex-row justify-between sm:items-center">
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
          getWorkspaceFallback(workspace.workspace_name, index)
        )}

        <div className="flex flex-col gap-2">
          <p className="text-l font-medium capitalize">
            {workspace.workspace_name}
          </p>

          <div className="flex gap-3 items-center">
            <div className="flex -space-x-4 rtl:space-x-reverse">
              {membersLoading ? (
                <p className="text-gray-200 text-sm">Loading...</p>
              ) : (
                members.slice(0, 4).map((m, idx) =>
                  m.user_profiles?.avatar_url ? (
                    <Avatar
                      key={m.user_id}
                      className="w-7 h-7 border-2 border-white rounded-none"
                    >
                      <AvatarImage
                        src={m.user_profiles?.avatar_url}
                        alt={m.user_profiles?.full_name}
                      />
                    </Avatar>
                  ) : (
                    getMemberFallback(m.user_profiles?.full_name, idx)
                  )
                )
              )}
            </div>
            <p className="font-light text-gray-300 text-sm">
              {members.length} Members
            </p>
          </div>
        </div>
      </div>

      <Link
        className="flex justify-center"
        to={`/workspace/${workspace.id}`}
        style={{ textDecoration: "none" }}
      >
        <Button
          // className="bg-[#4d3763] font-semibold py-2 px-4 rounded-sm text-amber-50 hover:bg-[#3e2e4f]"
          className="bg-transparent border-[#4d3763] border font-semibold py-2 px-4 rounded-sm text-[#4d3763] hover:border-[#3e2e4f] hover:text-[#3e2e4f] hover:bg-transparent"
        >
          Launch Workspace
        </Button>
      </Link>
    </div>
  )

}
export default WorkspaceCard;
