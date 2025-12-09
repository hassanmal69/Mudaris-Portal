import { setLastSeen } from "@/redux/features/lastSeen/lastseenSlice.js";
import { supabase } from "@/services/supabaseClient.js";
import React, { Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
const Chat = React.lazy(() => import("../../chat/index.jsx"));

const WorkSpaceInd = () => {
  const { groupId } = useParams();
  const userId = useSelector((s) => s.auth.user?.id);
  const dispatch = useDispatch()
  const lastSeen = async () => {
    const timestamp = new Date().toISOString();
    const { error } = await supabase.from('last_seen')
      .upsert({
        channel_id: groupId,
        user_id: userId,
        last_seen: timestamp
      }, {
        onConflict: 'user_id,channel_id'
      }).select()
    if (error) throw new Error(error)
    dispatch(setLastSeen({timestamp,groupId}))
  }
  useEffect(() => {
    if (!groupId) return;
    lastSeen();
    return () => {
      lastSeen();
    };
  }, [groupId]);
  return (
    <div className="flex w-full bg-(--background) h-full">
      <Suspense fallback={<div>Loading...</div>}>
        <Chat />
      </Suspense>
    </div>
  );
};

export default WorkSpaceInd;
