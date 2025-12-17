import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { fetchAllWorkspaces } from "@/redux/features/workspace/workspaceSlice.js";
import {
  fetchWorkspaceMembers,
} from "@/redux/features/workspaceMembers/WorkspaceMembersSlice.js";
import { supabase } from "@/services/supabaseClient.js";
import WorkspaceCard from "./workspaceCard.jsx";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button.jsx";

const Workspace = () => {
  const dispatch = useDispatch();
  const { loading, workspaces } = useSelector((state) => state.workSpaces, shallowEqual);
  const [workspacesWithDetails, setWorkspacesWithDetails] = useState([]);
  const [showAll, setShowAll] = useState(false);
  console.count("workspace");
  useEffect(() => {
    dispatch(fetchAllWorkspaces()); //   fetch all workspaces once on mount
  }, []);

  const fetchDetails = async () => {
    if (workspaces.length === 0) return;
    const details = await Promise.all(
      workspaces.map(async (w) => {
        const membersRes = await dispatch(fetchWorkspaceMembers(w.id));

        const { data } = await supabase
          .from("channels")
          .select("id")
          .eq("workspace_id", w.id)
          .order("created_at", { ascending: true })
          .limit(1)
          .maybeSingle();

        console.log(membersRes, "members");
        return {
          workspace: w,
          members: membersRes.payload || [],
          firstChannelId: data?.id || null,
        };
      })
    );
    setWorkspacesWithDetails(prev => {
      if (JSON.stringify(prev) === JSON.stringify(details)) return prev;
      return details;
    });
    // console.log(details, "details");
  }
  useEffect(() => {
    if (!workspaces.length) return;
    if (workspacesWithDetails.length) return;

    fetchDetails();
  }, [workspaces]);
  // Memoize visible workspaces for toggling
  const visibleWorkspaces = useMemo(() => {
    return showAll ? workspacesWithDetails : workspacesWithDetails.slice(0, 3);
  }, [showAll, workspacesWithDetails]);
  return (
    <section>
      <div className="flex w-full h-full flex-col gap-4">
        {loading && <p>Loading...</p>}
        {visibleWorkspaces.length > 0 ? (
          visibleWorkspaces?.map((details, i) => (
            <WorkspaceCard
              key={details.id}
              workspace={details.workspace}
              members={details.members}
              membersLoading={false} // already fetched
              firstChannelId={details.firstChannelId}
              index={i}
            />
          ))
        ) : (
          <h2>Please create a workspace</h2>
        )}

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

