import React, { useState } from 'react'
import axios from "axios"
import { useEffect } from 'react'
import { supabase } from '../supabaseClient.js'
import { Link } from 'react-router-dom';

const Workspace = () => {
    const [workspace, setworkspace] = useState('')
    const [allworkspace, setAllworkspace] = useState([])
    const handleSubmit = async (e) => {
        e.preventDefault();
        setAllworkspace((prev) => [...prev, workspace])
        if (!workspace.trim()) return
        setworkspace('')
        try {
            await axios.post('/api/ws', {
                workspace,
            })
        } catch (error) {
            console.error("error coming in workspacees", error)
        }
    }
    const fetchWs = () => {
        axios.get('/api/ws/getData').then((response) => {
            setAllworkspace(response?.data?.data)
        }).catch((error) => console.error(error))
    }
    useEffect(() => {
        fetchWs();
        const channel = supabase.channel('ws-channel').
            on("postgres_changes", {
                event: "INSERT",
                schema: "public",
                table: "workspaces"
            },
                (payload) => {
                    const newShey = payload.new
                    setAllworkspace((prev) => [newShey, ...prev])
                }
            )
            .subscribe()
        return () => {
            supabase.removeChannel(channel)
        }
    }, [])

    return (
        <div>
            <form action="" onSubmit={handleSubmit} method="post">
                <input type="text" placeholder='add your workspace'
                    value={workspace}
                    onChange={(e) => setworkspace(e.target.value)} />
                <button>add</button>
            </form>
            {allworkspace.map((w, i) => (
                <Link key={i} to={`/workspace/${w.id}`} className='flex flex-col' style={{ textDecoration: 'none' }}>
                    <button>{w.wsName}</button>
                </Link>
            ))}
        </div>
    )
}

export default Workspace