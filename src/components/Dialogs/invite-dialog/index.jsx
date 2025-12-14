import React, { useState, useEffect, useMemo } from "react";
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
import { fetchWorkspaceById } from "@/redux/features/workspace/workspaceSlice";
import { fetchChannels } from "@/redux/features/channels/channelsSlice.js";
import { addToast } from "@/redux/features/toast/toastSlice";

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
  const channelState = useSelector((state) => state.channels);
  const isChannelsLoaded = channelState.allIds.length > 0;

  // Fetch workspace info once
  useEffect(() => {
    if (workspace_id) dispatch(fetchWorkspaceById(workspace_id));
  }, [workspace_id, dispatch]);

  // Fetch channels only if not loaded
  useEffect(() => {
    if (workspace_id && !isChannelsLoaded) {
      dispatch(fetchChannels(workspace_id));
    }
  }, [workspace_id, dispatch, isChannelsLoaded]);

  // Prepare suggested channels from Redux
  const suggestedChannels = useMemo(() => {
    if (!isChannelsLoaded) return [];
    return channelState.allIds.map((id) => ({
      id,
      name: channelState.byId[id]?.channel_name,
      visibility: channelState.byId[id]?.visibility,
    }));
  }, [channelState, isChannelsLoaded]);

  // Pre-fill selected channels for step 1
  useEffect(() => {
    if (step === 1 && channels.length === 0 && suggestedChannels.length > 0) {
      setChannels(suggestedChannels.map((ch) => ch.id));
    }
  }, [step, suggestedChannels, channels.length]);

  const allowedChannels = useMemo(
    () =>
      suggestedChannels
        .filter((ch) => ch.visibility === "public")
        .map((ch) => ch.id),
    [suggestedChannels]
  );

  const handleCopyLink = async () => {
    for (const email of emails) {
      const link = await createInvitation({
        email,
        allowedChannels,
        workspace_id,
      });
      if (link) {
        await navigator.clipboard.writeText(link);
        alert(`Invitation link copied for ${email}`);
      }
    }
  };
  console.log(channels, "this is channels");
  const sendEmail = async () => {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();

      if (error || !session) {
        dispatch(
          addToast({
            message: "You must be logged in to invite users.",
            type: "destructive",
            duration: 3000,
          })
        );
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            workspace_id,
            emails,
            workspaceName: currentWorkspace?.workspace_name || "Workspace",
            channels,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        alert("Server error: " + JSON.stringify(data));
        return;
      }

      const failed = data.results.filter((r) => r.error);
      if (failed.length > 0) {
        dispatch(
          addToast({
            message:
              "Some invitations failed:\n" +
              failed.map((f) => `${f.email}: ${f.error}`).join("\n"),
            type: "destructive",
            duration: 3000,
          })
        );
      } else {
        dispatch(
          addToast({
            message: "All invitations sent successfully!",
            type: "success",
            duration: 3000,
          })
        );
      }
    } catch (err) {
      console.error("Unexpected error:", err);
      dispatch(
        addToast({
          message: "Unexpected error while sending invitations.",
          type: "destructive",
          duration: 3000,
        })
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
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
