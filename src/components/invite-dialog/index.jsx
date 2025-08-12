import React, { useState } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InviteByEmail from "./steps/InviteByEmail";
import Channelinvitation from "./steps/Channelinvitation";
import { useParams } from "react-router-dom";
import createInvitation from "@/utils/invite/createInvitation";
const workspace_name = "Mudaris Academy"; // Replace with dynamic value if needed
const suggestedChannels = ["channel 01", "channel 02"];

const InviteDialog = ({ open, onOpenChange }) => {
  const [step, setStep] = useState(0);
  const [emails, setEmails] = useState([]);
  const [channels, setChannels] = useState([]);
  const { workspace_id } = useParams();

  const handleCopyLink = async () => {
    let copied = false;
    for (const email of emails) {
      const link = await createInvitation({
        email,
        workspace_id: workspace_id,
      });
      if (link) {
        await navigator.clipboard.writeText(link);
        alert(`Invitation link copied for ${email}`);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Invite people to {workspace_name}</DialogTitle>
        </DialogHeader>

        {step === 0 && (
          <InviteByEmail
            emails={emails}
            setEmails={setEmails}
            onCopyLink={handleCopyLink}
            onNext={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <Channelinvitation
            channels={channels}
            setChannels={setChannels}
            suggestedChannels={suggestedChannels}
            onBack={() => setStep(0)}
            onSend={() => {
              // You can handle send logic here
              onOpenChange(false);
              setTimeout(() => {
                setStep(0);
                setEmails([]);
                setChannels([]);
              }, 300);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InviteDialog;
