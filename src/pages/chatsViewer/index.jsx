import { supabase } from '@/services/supabaseClient'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const HandleChatsViewer = () => {
    const [incomingData, setIncomingData] = useState([])

    const handleDataComing = async () => {
        const { data, error } = await supabase
            .from('directMessagesChannel')
            .select(`
      id,
      created_at,
      token,
      sender_id,
      receiver_id,
      sender:sender_id (
        id,
        full_name,
        avatar_url
      ),
      receiver:receiver_id (
        id,
        full_name,
        avatar_url
      )
    `)

        if (error) {
            console.error('Supabase error:', error)
            return
        }

        console.log('Incoming data:', data)
        setIncomingData(data || [])
    }

    useEffect(() => {
        handleDataComing()
    }, [])

    return (
        <div className='bg-black h-dvh w-full text-white p-4'>
            <h2 className='mb-4'>Click to see chats</h2>
            {incomingData.length > 0 ? (
                incomingData.map((m, i) => (
                    <div key={i} className='border-b border-gray-700 py-2'>
                        <Link to={`/seePersonalChats/${m.token}`}>
                            Chat between {m?.receiver?.full_name} and {m?.sender?.full_name}</Link>
                    </div>
                ))
            ) : (
                <p>No chats found.</p>
            )}
        </div>
    )
}

export default HandleChatsViewer
