import React, { useEffect } from 'react'
import axios from "axios"
import { useState } from 'react'
import { supabase } from '../supabaseClient.js'
import Chat from './chat.jsx';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
const Groups = ({ workspaceId }) => {
    const [group, setGroup] = useState('')
    const [allGroups, setallGroups] = useState([])
    const { groupId } = useParams();
    const navigate = useNavigate()
    const handleSubmit = async (e) => {
        e.preventDefault();
        setallGroups((prev) => [...prev, group])
        setGroup('')
        try {
            await axios.post('/api/group', {
                group,
                workspaceId
            })
        } catch (error) {
            console.error("error coming in workspacees", error)
        }
    }
    const fetchGroups = () => {
        axios.post('/api/group/getGroups', {
            workspaceId
        }).then((response) => {
            setallGroups(response?.data?.data)
        }).catch((error) => console.error(error))
    }
    useEffect(() => {
        fetchGroups();
        const channel = supabase.channel('ws-channel').
            on("postgres_changes", {
                event: "INSERT",
                schema: "public",
                table: "groups"
            },
                (payload) => {
                    const newShey = payload.new
                    setallGroups((prev) => [newShey, ...prev])
                    if (!groupId) {
                        navigate(`/workspace/${workspaceId}/group/${newShey.id}`);
                    }
                }
            )
            .subscribe()
        return () => {
            supabase.removeChannel(channel)
        }
    }, [])
    return (
        <div className='flex'>
            <div className="flex flex-col">
                <form onSubmit={handleSubmit}>
                    <input type="text" value={group} onChange={(e) => setGroup(e.target.value)} />
                    <button type='submit'>submit</button>
                </form>
                <div className="flex flex-col gap-2.5">
                    {
                        allGroups.map((m, i) => (
                            <Link key={i} to={`/workspace/${workspaceId}/group/${m.id}`} className='flex flex-col' style={{ textDecoration: 'none' }}>
                                <button>{m.groupName}</button>
                            </Link>
                        ))
                    }
                </div>
            </div>

            <Chat />
        </div>
    )
}

export default Groups