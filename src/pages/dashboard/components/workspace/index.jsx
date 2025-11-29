import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchAllWorkspaces,
  addWorkspacesRealtime,
} from "@/redux/features/workspace/workspaceSlice.js";
import { supabase } from "@/services/supabaseClient.js";
import WorkspaceCard from "./workspaceCard.jsx";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { fetchUserWorkspace } from "@/redux/features/workspaceMembers/WorkspaceMembersSlice.js";
import { Button } from "@/components/ui/button.jsx";
const Workspace = () => {
  const { session } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [showWs, setShowWs] = useState([]);
  const { workspaces, loading } = useSelector((state) => state.workSpaces);
  const [showAll, setShowAll] = useState(false);
  //  const {workspaceMembers}
  useEffect(() => {
    dispatch(fetchAllWorkspaces());
  }, [dispatch]);

  // Subscribe to real-time changes
  useEffect(() => {
    const subscription = supabase
      .channel("workspaces_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "workspaces" },
        (payload) => {
          if (
            payload.eventType === "INSERT" ||
            payload.eventType === "UPDATE"
          ) {
            dispatch(addWorkspacesRealtime(payload.new));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [dispatch]);

  const fetching = async () => {
    const wsMember = await dispatch(fetchUserWorkspace(session?.user?.id));
    setShowWs(wsMember?.payload);
  };
  useEffect(() => {
    fetching();
  }, []);

  const visibleWorkspaces = showAll ? showWs : showWs.slice(0, 3);

  return (
    <section>
      <div className="flex w-full h-full flex-col gap-4">
        {loading && <p>Loading...</p>}

        {visibleWorkspaces.map((w, i) => (
          <WorkspaceCard
            key={w?.workspaces.id}
            workspace={w?.workspaces}
            index={i}
          />
        ))}

        {/* Toggle button */}
        <div className="flex justify-center">
          {workspaces?.length > 3 && (
            <Button
              onClick={() => setShowAll((prev) => !prev)}
              variant={"outline"}
            >
              {showAll ? (
                <>
                  See less <ChevronUpIcon className="h-4 w-4" />
                </>
              ) : (
                <>
                  See more <ChevronDownIcon className="h-4 w-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
};

export default Workspace;
