import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/services/supabaseClient.js";
import WorkspaceCard from "./workspaceCard.jsx";
import { ChevronDownIcon, ChevronUpIcon } from "@radix-ui/react-icons";
import { Button } from "@/components/ui/button.jsx";

const Workspace = () => {
  const [workspacesWithDetails, setWorkspacesWithDetails] = useState([]);
  const [showAll, setShowAll] = useState(false);
  useEffect(() => {
    fetchingDetails()
  }, [])
  const fetchingDetails = async () => {
    const { data, error } = await supabase.functions.invoke('fetchingWorkspaces', {
      body: { name: 'Functions' },
    })
    if (error) {
      console.error(error);
      return;
    }
    console.log('dta is',data)
    setWorkspacesWithDetails(data)
  }
  const visibleWorkspaces = useMemo(() => {
    return showAll ? workspacesWithDetails : workspacesWithDetails.slice(0, 3);
  }, [showAll, workspacesWithDetails]);
  return (
    <section>
      <div className="flex w-full h-full flex-col gap-4">
        {visibleWorkspaces.length > 0 ? (
          visibleWorkspaces.map((item) => {
            return (
              <WorkspaceCard
                key={item.workspace.id}
                workspace={item.workspace}
                members={item.members}
                count={item.count}
                firstChannelId={item.firstChannelId}
              />
            )
          })
        ) : (
          <h2>No Workspace to Show</h2>
        )}

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

