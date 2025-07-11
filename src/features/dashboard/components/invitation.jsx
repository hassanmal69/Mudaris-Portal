import React from 'react'
import { useSearchParams } from 'react-router-dom';

const Invitation = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token')
    return (
        <div>Invitation
            <h1>Welcome</h1>
            <p>{token}</p>
        </div>
    )
}

export default Invitation