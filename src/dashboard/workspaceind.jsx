import React, { useEffect, useState } from 'react'
import Chat from './chat.jsx'
import Groups from './group.jsx'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient.js'
import { useParams } from 'react-router-dom'
import InviteSend from './invitationsent.jsx'
import { UserAuth } from '../context/authContext.jsx'
import Members from './members.jsx'
import axios from 'axios'
const WorkSpaceInd = () => {
  const { workspaceId, groupId } = useParams()
  const navigate = useNavigate();
  const { logOut, session } = UserAuth();
  const [groups, setGroups] = useState([])
  const [email, setEmail] = useState('')
  const [isScreen, setisScreen] = useState(false)
  const fetchGroups = async () => {
    const { data, error } = await supabase
      .from('groups')
      .select('id,groupName')
      .eq('workspaceId', workspaceId)
      .order("created_at", { ascending: true })
    if (!error && data.length > 0) {
      setGroups(data)
    }
    setEmail(session.user.email)
    const { data: checkData, error: checkError } = await supabase.from('invitations')
      .select('workspaceId')
    if (checkError) {
      console.error('error arha ha in ws-ind')
    }
    if (!groupId) navigate(`/workspace/${workspaceId}/group/${data[0].id}`, { replace: true })
  }
  useEffect(() => {
    fetchGroups();
  })
  const handleLogout = () => {
    logOut();
  }
  const toggleScreen = () => {
    setisScreen((prev) => !prev)
  }
  return (
    <div className='flex h-[100vh] w-full relative'>
      {isScreen && <Members />}
      <div className="w-full h-15 bg-gray-500 absolute flex justify-center">
        <h1>Top Bar</h1>
        <button onClick={toggleScreen}>view all members</button>
      </div>
      <div className="flex flex-col bg-gray-900 h-full justify-center items-center">
        <Groups workspaceId={workspaceId} />
        <InviteSend />
        <button onClick={handleLogout}>LOG OUT</button>
      </div>
      <Chat />
    </div>
  )
}

export default WorkSpaceInd