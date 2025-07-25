import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import ChannelInfo from "./steps/ChannelInfo";
import ChannelType from "./steps/ChannelType";
import InviteUsers from "./steps/InviteUsers";
import {
  channelInfoSchema,
  inviteUsersSchema,
} from "@/validation/authSchema.js";

const steps = ["Channel Info", "Channel Type", "Invite Users"];

const AddChannelDialog = ({ open, onOpenChange }) => {
  const [step, setStep] = useState(0);
  const [state, setState] = useState({
    name: "",
    description: "",
    type: "public",
    users: [],
  });
  const [errors, setErrors] = useState({});
  const dialogRef = useRef();

  const validateStep = async () => {
    if (step === 0) {
      try {
        await channelInfoSchema.validate(state, { abortEarly: false });
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
    if (step === 2 && state.type === "private") {
      try {
        await inviteUsersSchema.validate(
          { users: state.users },
          { abortEarly: false }
        );
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

  const handleSubmit = async () => {
    if (await validateStep()) {
      console.log({ ...state });
      onOpenChange(false);
      setTimeout(() => {
        setStep(0);
        setState({ name: "", description: "", type: "public", users: [] });
        setErrors({});
      }, 300);
    }
  };

  const handleSkip = () => handleSubmit();
  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://mudaris.app/invite-link");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange} initialFocus={dialogRef}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>Add Channel</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2 mb-2">
            {steps.map((label, idx) => (
              <React.Fragment key={label}>
                <div
                  className={`w-2 h-2 rounded-full ${
                    step >= idx ? "bg-[#556cd6]" : "bg-gray-300"
                  }`}
                ></div>
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-gray-200" />
                )}
              </React.Fragment>
            ))}
          </div>
          {step === 0 && (
            <ChannelInfo state={state} setState={setState} errors={errors} />
          )}
          {step === 1 && <ChannelType state={state} setState={setState} />}
          {step === 2 && state.type === "private" && (
            <InviteUsers
              state={state}
              setState={setState}
              errors={errors}
              onSkip={handleSkip}
              onCopyLink={handleCopyLink}
            />
          )}
        </div>
        <div className="flex gap-2 mt-6">
          {step > 0 && (
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
          )}
          {step < 2 && <Button onClick={handleNext}>Next</Button>}
          {step === 2 && state.type === "private" && (
            <Button onClick={handleSubmit}>Finish</Button>
          )}
          {step === 1 && state.type === "public" && (
            <Button onClick={handleSubmit}>Finish</Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddChannelDialog;
