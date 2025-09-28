import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ChannelInfo from "./steps/ChannelInfo";
import ChannelType from "./steps/ChannelType";
import {
  channelInfoSchema,
  inviteUsersSchema,
} from "@/validation/authSchema.js";
import { useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { createChannel } from "@/features/channels/channelsSlice.js";
import InviteChannelUsers from "./steps/InviteChannelUsers";
import { ChannelStepIndicator } from "./steps/ChannelStepIndicator";

const steps = ["Channel Info", "Channel visibility", "Invite Users"];

const initialState = {
  name: "",
  description: "",
  visibility: "public",
  users: [],
};
const AddChannelDialog = ({ open, onOpenChange }) => {
  const { workspace_id } = useParams();
  const { session } = useSelector((state) => state.auth);
  const EmptyArray = [];
  const workspaceMembers = useSelector(
    (state) =>
      state.workspaceMembers.byWorkspaceId[workspace_id]?.members || EmptyArray
  );

  let creatorId;
  if (session.user?.user_metadata?.user_role === "admin") {
    creatorId = session?.user?.id;
  }
  const resetChannelState = (setChannelData, setStep) => {
    setChannelData({ name: "", type: "public", invitedUsers: [] });
    setStep(0);
  };

  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const dialogRef = useRef();

  const [channelData, setChannelData] = useState(initialState);

  const dispatch = useDispatch();

  const getValidationSchema = () => {
    if (step === 0) return channelInfoSchema;
    if (step === 2 && channelData.visibility === "private")
      return inviteUsersSchema;

    return null;
  };

  const validateStep = async () => {
    const schema = getValidationSchema();
    const currentData = channelData;

    if (schema) {
      try {
        await schema.validate(currentData, { abortEarly: false });
        setErrors({});
        return true;
      } catch (err) {
        const errObj = {};
        err.inner.forEach((e) => {
          errObj[e.path] = e.message;
        });
        setErrors(errObj);
        return false;
      }
    }
    setErrors({});
    return true;
  };

  const handleNext = async () => {
    if (await validateStep()) {
      setStep((s) => s + 1);
    }
  };

  const handleBack = () => setStep((s) => s - 1);
  const handleClose = () => {
    resetChannelState(setChannelData, setStep);
    onOpenChange(false);
  };
  const resetStates = () => {
    setStep(0);
    setErrors({});
    setChannelData(initialState);
  };

  const handleSubmit = async () => {
    const { name, description, visibility, users } = channelData;
    let membersSet = new Set();
    if (visibility === "public") {
      // all workspace members
      workspaceMembers.forEach((m) => membersSet.add(m.user_id));
    } else {
      // private → only invited users
      users.forEach((u) => membersSet.add(u.id));
    }

    // add creator always
    if (creatorId) membersSet.add(creatorId);
    dispatch(
      createChannel({
        channel_name: name,
        description,
        visibility,
        channel_members: Array.from(membersSet),
        workspace_id,
        creator_id: creatorId,
      })
    );

    handleClose();
    onOpenChange(false);
    setTimeout(resetStates, 300);
  };

  const handleSkip = () => handleSubmit();

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://mudaris.app/invite-link");
  };

  const renderStep = () => {
    if (step === 0) {
      return (
        <ChannelInfo
          state={channelData}
          setState={setChannelData}
          errors={errors}
        />
      );
    }

    if (step === 1)
      return <ChannelType state={channelData} setState={setChannelData} />;
    if (step === 2 && channelData.visibility === "private")
      return (
        <InviteChannelUsers
          state={channelData}
          setState={setChannelData}
          errors={errors}
          onSkip={handleSkip}
          onCopyLink={handleCopyLink}
        />
      );

    return null;
  };

  const renderFooterButtons = () => (
    <div className="flex gap-2 justify-between mt-6">
      <div className="flex gap-2">
        {step > 0 && (
          <Button
            className="bg-transparent transition delay-150 duration-300 ease-in-out hover:bg-[#c50000] hover:text-[#eee] border border-[#c50000] text-[#c50000]"
            variant="outline"
            onClick={handleBack}
          >
            Back
          </Button>
        )}
        {step < 2 && !(channelData.visibility === "public" && step === 1) && (
          <Button
            className="bg-transparent transition delay-150 duration-300 ease-in-out hover:bg-[#556cd6] hover:text-[#eee] border border-[#556cd6] text-[#556cd6]"
            onClick={handleNext}
          >
            Next
          </Button>
        )}
      </div>

      {((step === 1 && channelData.visibility === "public") ||
        (step === 2 && channelData.visibility === "private")) && (
        <Button
          className="bg-[#008000] transition delay-150 duration-300 ease-in-out hover:bg-transparent hover:text-[#008000] border border-[#008000] text-[#fff]"
          onClick={handleSubmit}
        >
          Finish
        </Button>
      )}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange} initialFocus={dialogRef}>
      <DialogContent className="max-w-md bg-black/90 border-[#111] text-gray-400 w-full">
        <DialogHeader>
          <DialogTitle>Add Channel</DialogTitle>
        </DialogHeader>
        {renderStep()}
        <ChannelStepIndicator step={step} steps={steps} />

        {renderFooterButtons()}
      </DialogContent>
    </Dialog>
  );
};

export default AddChannelDialog;
