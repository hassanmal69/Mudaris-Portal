import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import InviteStepEmails from "./InviteStepEmails";
import InviteStepChannels from "./InviteStepChannels";

const workspace_name = "Mudaris Academy"; // Replace with dynamic value if needed
const suggestedChannels = ["channel 01", "channel 02"];

const InviteDialog = ({ open, onOpenChange }) => {
  const [step, setStep] = useState(0);
  const [emails, setEmails] = useState([]);
  const [channels, setChannels] = useState([]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://mudaris.app/invite-link");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Invite people to {workspace_name}</DialogTitle>
        </DialogHeader>
        {step === 0 && (
          <InviteStepEmails
            emails={emails}
            setEmails={setEmails}
            onCopyLink={handleCopyLink}
            onNext={() => setStep(1)}
          />
        )}
        {step === 1 && (
          <InviteStepChannels
            channels={channels}
            setChannels={setChannels}
            suggestedChannels={suggestedChannels}
            onCopyLink={handleCopyLink}
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
