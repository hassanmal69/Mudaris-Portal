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
import { supabase } from "@/services/supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { fetchWorkspaceById } from "@/features/workspace/workspaceSlice";
import { fetchChannels } from "@/features/channels/channelsSlice.js";

const InviteDialog = ({ open, onOpenChange }) => {
  const [step, setStep] = useState(0);
  const [emails, setEmails] = useState([]);
  const [channels, setChannels] = useState([]);
  const { workspace_id } = useParams();
  const dispatch = useDispatch();

  // Redux state
  const { currentWorkspace, loading } = useSelector(
    (state) => state.workSpaces
  );
  const channelState = useSelector((state) => state.channels); // <-- get channels slice

  // Fetch workspace info from Redux
  useEffect(() => {
    if (workspace_id) {
      dispatch(fetchWorkspaceById(workspace_id));
    }
  }, [workspace_id, dispatch]);

  // Fetch channels from Redux
  useEffect(() => {
    if (workspace_id) {
      dispatch(fetchChannels(workspace_id));
    }
  }, [workspace_id, dispatch]);

  // Suggested channels from Redux
  const suggestedChannels = channelState.allIds.map(
    (id) => channelState.byId[id]?.channel_name
  );

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
        "https://surdziukuzjqthcfqoax.supabase.co/functions/v1/workspace-invite-admin",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            workspace_id,
            emails,
          }),
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
      <DialogContent className="max-w-md w-full" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>
            Invite people to{" "}
            {loading
              ? "Loading..."
              : currentWorkspace?.workspace_name || "Workspace"}
          </DialogTitle>
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
