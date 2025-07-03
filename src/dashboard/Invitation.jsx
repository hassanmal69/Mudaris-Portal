import React from 'react'
import { useSearchParams } from 'react-router-dom';

const Invitation = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token')
    const email = searchParams.get('email')
    return (
        <div>Invitation
            <h1>Welcome {email}</h1>
            <p>{token}</p>
        </div>
    )
}

export default Invitation