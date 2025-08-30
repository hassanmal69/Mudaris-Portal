import React, { useState, useEffect } from "react";
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
import { supabase } from "@/services/supabaseClient"; // adjust your import

const InviteDialog = ({ open, onOpenChange }) => {
  const [step, setStep] = useState(0);
  const [emails, setEmails] = useState([]);
  const [channels, setChannels] = useState([]);
  const [workspaceName, setWorkspaceName] = useState("");
  const [suggestedChannels, setSuggestedChannels] = useState([]);
  const { workspace_id } = useParams();

  useEffect(() => {
    async function fetchWorkspaceAndChannels() {
      // Fetch workspace name
      const { data: wsData, error: wsError } = await supabase
        .from("workspaces")
        .select("workspace_name")
        .eq("id", workspace_id)
        .single();
      if (wsData && wsData.workspace_name) {
        setWorkspaceName(wsData.workspace_name);
      } else {
        setWorkspaceName("Workspace");
      }

      // Fetch channels
      const { data: channelsData, error: channelsError } = await supabase
        .from("channels")
        .select("channel_name")
        .eq("workspace_id", workspace_id);
      if (channelsData) {
        setSuggestedChannels(channelsData.map((c) => c.channel_name));
      } else {
        setSuggestedChannels([]);
      }
    }
    if (workspace_id) fetchWorkspaceAndChannels();
  }, [workspace_id]);

  const handleCopyLink = async () => {
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

  const sendEmail = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        alert("❌ You must be logged in to invite users.");
        return;
      }

      const res = await fetch(
        "https://surdziukuzjqthcfqoax.supabase.co/functions/v1/invite-user",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ emails }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Failed:", data);
        alert("Server error: " + JSON.stringify(data));
        return;
      }

      const failed = data.results.filter((r) => r.error);
      if (failed.length > 0) {
        alert(
          "Some invitations failed:\n" +
            failed.map((f) => `${f.email}: ${f.error}`).join("\n")
        );
      } else {
        alert("✅ All invitations sent successfully!");
      }
    } catch (err) {
      console.error("⚠️ Unexpected error:", err);
      alert("Unexpected error while sending invitations.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Invite people to {workspaceName}</DialogTitle>
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
            onSend={sendEmail}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default InviteDialog;
