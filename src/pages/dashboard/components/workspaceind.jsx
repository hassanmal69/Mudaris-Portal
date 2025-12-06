import { supabase } from "@/services/supabaseClient.js";
import React, { Suspense, useEffect } from "react";
import { useParams } from "react-router-dom";
const Chat = React.lazy(() => import("../../chat/index.jsx"));

const WorkSpaceInd = () => {
  const { groupId } = useParams()
  useEffect(() => {
    const lastSeenUpdate = async () => {
      const { error } = await supabase.from('last_seen')
        .upsert({
          channel_id: groupId
        },
          { onConflict: "user_id,channel_id" }
        )
      if (error) console.error(error)
    }
    lastSeenUpdate()
    return () => {
      lastSeenUpdate()
    }
  }, [groupId])
  return (
    <div className="flex w-full bg-(--background) h-full">
      <Suspense fallback={<div>Loading...</div>}>
        <Chat />
      </Suspense>
    </div>
  );
};

export default WorkSpaceInd;
