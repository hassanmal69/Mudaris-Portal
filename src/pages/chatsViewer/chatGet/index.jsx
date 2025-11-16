import { supabase } from '@/services/supabaseClient'
import React, { useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'

const PAGE_SIZE = 50 // Fetch 50 messages per request

const ChatGet = () => {
    const { token } = useParams()
    const [msgs, setMsgs] = useState([])
    const [loading, setLoading] = useState(false)
    const [hasMore, setHasMore] = useState(true)

    const fetchMessages = useCallback(async () => {
        if (loading || !hasMore) return
        setLoading(true)

        const start = msgs.length
        const end = start + PAGE_SIZE - 1

        const { data, error } = await supabase
            .from('messages')
            .select('*')
            .eq('token', token)
            .order('created_at', { ascending: true })
            .range(start, end)

        if (error) {
            console.error('Supabase error:', error)
            setLoading(false)
            return
        }

        if (!data?.length || data.length < PAGE_SIZE) setHasMore(false)

        setMsgs(prev => [...prev, ...data])
        setLoading(false)
    }, [loading, hasMore, msgs.length, token])

    useEffect(() => {
        let isMounted = true
        const load = async () => {
            if (!isMounted) return
            await fetchMessages()
        }
        setMsgs([])
        setHasMore(true)
        load()
        return () => { isMounted = false }
    }, [token])

    useEffect(() => {
        let timeout
        const handleScroll = () => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                if (
                    window.innerHeight + window.scrollY >=
                    document.body.offsetHeight - 150
                ) {
                    fetchMessages()
                }
            }, 150)
        }

        window.addEventListener('scroll', handleScroll)
        return () => {
            clearTimeout(timeout)
            window.removeEventListener('scroll', handleScroll)
        }
    }, [fetchMessages])

    return (
        <div className='text-white bg-black min-h-screen p-4'>
            <h1 className='text-xl mb-4 font-bold'>ChatGet</h1>

            {msgs.length > 0 ? (
                msgs.map((m, i) => (
                    <div
                        key={m.id || i}
                        className='border-b border-gray-700 py-2'
                        dangerouslySetInnerHTML={{ __html: m.content }}
                    />
                ))
            ) : !loading ? (
                <p>No chats found.</p>
            ) : null}

            {loading && <p className='text-gray-400 mt-4'>Loading more...</p>}
        </div>
    )
}

export default ChatGet
