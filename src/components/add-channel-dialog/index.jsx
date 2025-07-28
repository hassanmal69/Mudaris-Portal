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
import AddavatarInWS from "./steps/addAvatar";
import {
  channelInfoSchema,
  inviteUsersSchema,
  workspaceInfoSchema,
} from "@/validation/authSchema.js";

const steps = ["Channel Info", "Channel Type", "Invite Users"];

const StepIndicator = ({ step }) => (
  <div className="flex items-center gap-2 mb-2">
    {steps.map((label, idx) => (
      <React.Fragment key={label}>
        <div
          className={`w-2 h-2 rounded-full ${step >= idx ? "bg-[#556cd6]" : "bg-gray-300"}`}
        ></div>
        {idx < steps.length - 1 && <div className="flex-1 h-0.5 bg-gray-200" />}
      </React.Fragment>
    ))}
  </div>
);

const AddChannelDialog = ({ open, onOpenChange, usedIn }) => {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const dialogRef = useRef();

  const [state, setState] = useState({
    name: "",
    description: "",
    type: "public",
    users: [],
  });

  const [workspaceData, setWorkspaceData] = useState({
    name: "",
    description: "",
    avatarUrl: "",
    users: [],
  });

  const getValidationSchema = () => {
    if (usedIn === "createChannel") {
      if (step === 0) return channelInfoSchema;
      if (step === 2 && state.type === "private") return inviteUsersSchema;
    } else {
      if (step === 0) return workspaceInfoSchema;
      if (step === 1) return 
        if (step === 2) return inviteUsersSchema;
    }
    return null;
  };

  const validateStep = async () => {
    const schema = getValidationSchema();
    const currentData = usedIn === "createChannel" ? state : workspaceData;

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

  const resetStates = () => {
    setStep(0);
    setErrors({});
    setState({ name: "", description: "", type: "public", users: [] });
    setWorkspaceData({ name: "", description: "", avatarUrl: "", users: [] });
  };

  const handleSubmit = async () => {
    if (await validateStep()) {
      const formData = usedIn === "createChannel" ? state : workspaceData;
      console.log(formData);
      if (usedIn === "createChannel") onOpenChange(false);
      setTimeout(resetStates, 300);
    }
  };

  const handleSkip = () => handleSubmit();

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://mudaris.app/invite-link");
  };

  const renderStep = () => {
    if (usedIn === "createChannel") {
      if (step === 0)
        return <ChannelInfo state={state} setState={setState} errors={errors} />;
      if (step === 1)
        return <ChannelType state={state} setState={setState} />;
      if (step === 2 && state.type === "private")
        return (
          <InviteUsers
            state={state}
            usedIn={usedIn}
            setState={setState}
            errors={errors}
            onSkip={handleSkip}
            onCopyLink={handleCopyLink}
          />
        );
    } else {
      if (step === 0)
        return <ChannelInfo usedIn={usedIn} state={workspaceData} setState={setWorkspaceData} errors={errors} />;
      if (step === 1)
        return <AddavatarInWS usedIn={usedIn} state={workspaceData} setState={setWorkspaceData} />;
      if (step === 2)
        return (
          <InviteUsers
            state={workspaceData}
            usedIn={usedIn}
            setState={setWorkspaceData}
            errors={errors}
            onSkip={handleSkip}
            onCopyLink={handleCopyLink}
          />
        );
    }
    return null;
  };

  const renderFooterButtons = () => (
    <div className="flex gap-2 mt-6">
      {step > 0 && (
        <Button variant="outline" onClick={handleBack}>
          Back
        </Button>
      )}
      {step < 2 && <Button onClick={handleNext}>Next</Button>}
      {step === 2 && (
        <Button onClick={handleSubmit}>Finish</Button>
      )}
      {step === 1 && usedIn === "createChannel" && state.type === "public" && (
        <Button onClick={handleSubmit}>Finish</Button>
      )}
    </div>
  );

  if (usedIn === "createChannel") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange} initialFocus={dialogRef}>
        <DialogContent className="max-w-md w-full">
          <DialogHeader>
            <DialogTitle>Add Channel</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-6">
            <StepIndicator step={step} />
            {renderStep()}
          </div>
          {renderFooterButtons()}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col">
          <h2 className="text-center text-xl font-bold text-[#4d3763]">Create a new Workspace</h2>
          <p className="text-center text-[#4d3763]">Enter the details and your workspace will be ready</p>
        </div>
        <StepIndicator step={step} />
        {renderStep()}
      </div>
      {renderFooterButtons()}
    </div>
  );
};

export default AddChannelDialog;
