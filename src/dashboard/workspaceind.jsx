import React, { useEffect, useState } from 'react'
import Chat from './chat.jsx'
import Groups from './group.jsx'
import { Outlet, useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient.js'
import { useParams } from 'react-router-dom'
import InviteSend from './invitationsent.jsx'
const WorkSpaceInd = () => {
  const { workspaceId, groupId } = useParams()
  const navigate = useNavigate();
  const [groups, setGroups] = useState([])
  const fetchGroups = async () => {
    const { data, error } = await supabase
      .from('groups')
      .select('id,groupName')
      .eq('workspaceId', workspaceId)
      .order("created_at", { ascending: true })
    if (!error && data.length > 0) {
      setGroups(data)
    }
    if (!groupId) navigate(`/workspace/${workspaceId}/group/${data[0].id}`, { replace: true })
  }
  useEffect(() => {
    fetchGroups();
  })
  return (
    <div>
      <>

        <Groups workspaceId={workspaceId} />
        <InviteSend/>
      </>
    </div>
  )
}

export default WorkSpaceInd