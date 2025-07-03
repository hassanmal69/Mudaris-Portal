import { useState } from 'react';
import './App.css'
import SignUp from './signup'
import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
function App() {
  const navigate = useNavigate()

  const [jokes, setJokes] = useState([])
  useEffect(() => {
    axios.get('/api/jokes').then((response) => {
      setJokes(response.data)
    }
    ).catch((error) => console.log(error))
  }
  )
  useEffect(() => {
    const session = localStorage.getItem("session")
    if (session) {
      navigate('/dashboard')
    }
  }, [])
  return (
    <>
      <SignUp />
      <p className='text-white'>{jokes.length}</p>
      {
        jokes.map((joke, index) => (
          <div className="" key={index}>
            <h2>{joke.title}</h2>
            <p>{joke.description}</p>
          </div>
        ))
      }
    </>
  )
}

export default App
