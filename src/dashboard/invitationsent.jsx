import axios from 'axios';
import React, { useState } from 'react'
import { useParams } from 'react-router-dom'

const InviteSend = () => {
    const [inviteEmail, setInviteEmail] = useState("");
    const { workspaceId } = useParams()
    const {groupId}=useParams();
    const handleInvite = async () => {
        if (!inviteEmail) return;
        try {
            await axios.post("/api/invite", {
                email: inviteEmail,
                workspaceId,
                groupId
            });
            alert("Invite sent!");
            setInviteEmail("");
        } catch (err) {
            alert("Failed to send invite.",err);
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