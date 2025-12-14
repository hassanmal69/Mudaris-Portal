import React, { useEffect, useRef, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllWorkspaces } from "@/redux/features/workspace/workspaceSlice.js";
import {
  fetchWorkspaceMembers,
} from "@/redux/features/workspaceMembers/WorkspaceMembersSlice.js";
import { supabase } from "@/services/supabaseClient.js";
import WorkspaceCard from "./workspaceCard.jsx";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button.jsx";

const Workspace = () => {
  const renderCount = useRef(0);
  const dispatch = useDispatch();
  const { loading, workspaces } = useSelector((state) => state.workSpaces);
  const [workspacesWithDetails, setWorkspacesWithDetails] = useState([]);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    dispatch(fetchAllWorkspaces()); // fetch all workspaces once on mount
  }, [dispatch]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (workspaces.length === 0) return;

      const details = await Promise.all(
        workspaces.map(async (w) => {
          const membersRes = await dispatch(fetchWorkspaceMembers(w.id));
          const members = membersRes?.payload || [];

          const { data } = await supabase
            .from("channels")
            .select("id")
            .eq("workspace_id", w.id)
            .order("created_at", { ascending: true })
            .limit(1)
            .maybeSingle();

          return {
            id: w.id,
            workspace: w,
            members,
            firstChannelId: data?.id || null,
          };
        })
      );

      setWorkspacesWithDetails(details);
    };

    fetchDetails();
  }, [dispatch, workspaces]); // ✅ depends on Redux workspaces

  // Memoize visible workspaces for toggling
  const visibleWorkspaces = useMemo(() => {
    return showAll ? workspacesWithDetails : workspacesWithDetails.slice(0, 3);
  }, [showAll, workspacesWithDetails]);

  renderCount.current += 1;
  console.log("Workspace page renders:", renderCount.current);

  return (
    <section>
      <div className="flex w-full h-full flex-col gap-4">
        {loading && <p>Loading...</p>}

        {visibleWorkspaces.map((details, i) => (
          <WorkspaceCard
            key={details.id}
            workspace={details.workspace}
            members={details.members.members}
            membersLoading={false} // already fetched
            firstChannelId={details.firstChannelId}
            index={i}
          />
        ))}

        {/* Toggle button */}
        {workspacesWithDetails.length > 3 && (
          <div className="flex justify-center">
            <Button
              onClick={() => setShowAll((prev) => !prev)}
              variant="outline"
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
          </div>
        )}
      </div>
    </section>
  );
};

export default React.memo(Workspace);

Workspace.whyDidYouRender = true;
