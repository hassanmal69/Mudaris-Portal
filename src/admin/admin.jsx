import React, { useState } from 'react'
import MuxUploader from "@mux/mux-uploader-react";
import { supabase } from '../supabaseClient';

const AdminDashboard = () => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState({ name: "", desc: "" })
    const [error, setError] = useState("")
    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError("")
        try {
            const { error } = await supabase.from('video').insert([{
                title: data.name, description: data.desc
            }])
            if (error) {
                setError(error)
                console.error(error)
            }
        } catch (error) {
            console.error("error arha ha video ka meta data", error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div>admin HA GA TU
            <MuxUploader />
            <form onSubmit={handleSubmit} method='post'>
                <h1>HAN BHAI VIDEO DALNE AYA HA???</h1>
                <input type="text" value={data.name} onChange={(e) => setData({ ...data, name: e.target.value })} placeholder='nam bta' />
                <input type="text" value={data.desc} onChange={(e) => setData({ ...data, desc: e.target.value })} placeholder='description ha?' />
                <button type='submit' disabled={loading}>submit bhi kr de aab</button>
            </form>
            {error && <>{error.message}</>}
        </div>
    )
}

export default AdminDashboard