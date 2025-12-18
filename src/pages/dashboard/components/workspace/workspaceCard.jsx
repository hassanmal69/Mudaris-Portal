import React from "react";
import { Link } from "react-router-dom";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar.jsx";
import { Button } from "@/components/ui/button.jsx";
import WorkspaceFallback from "@/components/ui/workspaceFallback";
import UserFallback from "@/components/ui/userFallback";

const WorkspaceCard = ({
  workspace,
  members = [],
  membersLoading = false,
  firstChannelId = null,
  index,
}) => {
  const launchTo = firstChannelId
    ? `/workspace/${workspace.id}/group/${firstChannelId}`
    : `/workspace/${workspace.id}`;
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
                Object.entries(members).slice(0, 3).map((m, idx) =>
                (
                  <div key={m.user_id}>
                    {
                      m.user_profiles?.avatar_url ? (
                        <Avatar
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

                    }
                  </div>
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
        <Button variant="outline">Launch Workspace</Button>
      </Link>
    </div>
  );
};

export default React.memo(WorkspaceCard);
