import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/authContext';
import axios from 'axios';

const Login = () => {
  const { setSession, session } = UserAuth();
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  useEffect(() => {
    if (session) {
      navigate('/dashboard')
    }
  }, [session, navigate])
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true)
    try {
      const res = await axios.post('/api/signin', {
        email: email,
        password: password
      },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      const session = res.data?.session
      localStorage.setItem("session", JSON.stringify(session))
      setSession(session)
      navigate('/dashboard')
    } catch (error) {
      console.error("here are error in login in login.jsx", error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='enter username or email' />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='enter password' />
        <button type='submit' disabled={loading}>submit</button>
      </form>
      {error && <p>error coming in jsx of login{error}</p>}
    </div>
  )
}

export default Login