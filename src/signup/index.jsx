import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { UserAuth } from '../context/authContext';
// import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
const SignUp = () => {
    // me@gmail.com
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token')
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [password, setPassword] = useState('')
    const { setSession } = UserAuth();
    const [wsId, setWsId] = useState('')
    const [groupID, setGroupId] = useState('')
    const checkingToken = async () => {
        const res = await axios.post('/api/inviteValidation', {
            token: token
        })
        console.log(res.message)
        console.log(res.data?.data[0])
        setEmail(res.data?.data[0].email)
        setWsId(res.data?.data[0].workspaceId)
        setGroupId(res.data?.data[0].groupId)
        console.log(email, wsId, groupID)
    }
    useEffect(() => {
        checkingToken();
    })
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/api/signup', {
                email,
                password
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const session = response.data.session
            localStorage.setItem("session", JSON.stringify(session))
            setSession(session)
            navigate(`/workspace/${wsId}/group/${groupID}`)
        } catch (err) {
            const errorMessage = err.response?.data?.message
                || err.message
                || 'Signup failed';

            console.error('Signup error:', err.message);
            setError(errorMessage);
        } finally {
            setLoading(false);
        }

    };

    return (
        <div>
            <form onSubmit={handleSubmit} method="post">
                <input type="email" value={email} placeholder='you cant change it muhehe' />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='enter password' />
                <button type='submit' disabled={loading}>submit</button>
            </form>
            {error && <>{error.message}</>}
        </div>
    )
}

export default SignUp