import axios from 'axios';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import { UserAuth } from '../../../context/authContext';

const InviteSend = () => {
    const [inviteEmail, setInviteEmail] = useState("");
    const { workspaceId } = useParams()
    const { session } = UserAuth()
    const senderEmail = session?.user?.email
    const handleInvite = async () => {
        if (!inviteEmail || inviteEmail.trim() === '') return alert("enter emails");
        try {
            const res = await axios.post("/api/invite", {
                email: inviteEmail,
                workspaceId,
                senderEmail
            });
            alert("Invite sent!");
            console.log(res)
            setInviteEmail("");
        } catch (err) {
            alert("Failed to send invite.", err);
        }
    };

    return (
        <div>
            <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="Enter user's email"
            />
            <button onClick={handleInvite}>Send Invite</button>

        </div>
    )
}

export default InviteSend