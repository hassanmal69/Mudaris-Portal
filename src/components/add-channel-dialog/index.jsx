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
import { useParams } from "react-router-dom";
import { supabase } from "@/services/supabaseClient.js";
import { useSelector } from "react-redux";
const steps = ["Channel Info", "Channel visibility", "Invite Users"];

const StepIndicator = ({ step }) => (
  <div className="flex items-center gap-2 mb-2">
    {steps.map((label, idx) => (
      <React.Fragment key={label}>
        <div
          className={`w-2 h-2 rounded-full ${
            step >= idx ? "bg-[#556cd6]" : "bg-gray-300"
          }`}
        ></div>
        {idx < steps.length - 1 && <div className="flex-1 h-0.5 bg-gray-200" />}
      </React.Fragment>
    ))}
  </div>
);

const AddChannelDialog = ({ open, onOpenChange, usedIn }) => {
  const { workspace_id } = useParams();

  const userEmail = useSelector((state) => state.auth.session?.user?.email);
  if (userEmail === "me@gmail.com") {
    var adminId = useSelector((state) => state.auth.session?.user?.id);
  }
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const dialogRef = useRef();

  const [state, setState] = useState({
    name: "",
    description: "",
    visibility: "public",
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
      if (step === 2 && state.visibility === "private")
        return inviteUsersSchema;
    } else if (usedIn === "createWorkspace") {
      if (step === 0) return workspaceInfoSchema;
      if (step === 1) return;
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
    setState({ name: "", description: "", visibility: "public", users: [] });
    setWorkspaceData({ name: "", description: "", avatarUrl: "", users: [] });
  };

  const handleSubmit = async () => {
    if (await validateStep()) {
      const formData = usedIn === "createChannel" ? state : null;
      if (usedIn === "createChannel") {
        let { name, description, visibility, users } = formData;
        console.log(formData);

        const { data, error } = await supabase
          .from("channels")
          .insert({
            channel_name: name,
            description,
            visibility,
            channel_members: users.map((user) => user.id),
            workspace_id: workspace_id,
          })
          .select();

        if (usedIn === "createChannel") onOpenChange(false);
        if (error) {
          console.error(error);
        }
        setTimeout(resetStates, 300);
      } else if (usedIn === "createWorkspace") {
        console.log("clicked");
        const formData = usedIn === "createWorkspace" ? workspaceData : null;
        let { name, description, avatarUrl, users } = formData;
        const { data, error } = await supabase
          .from("workspaces")
          .insert({
            workspace_name: name,
            description,
            avatar_url: avatarUrl,
            owner_id: adminId,
          })
          .select();
        if (error) {
          console.error(error);
        }
        setTimeout(resetStates, 300);
      }
    }
  };

  const handleSkip = () => handleSubmit();

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://mudaris.app/invite-link");
  };

  const renderStep = () => {
    if (usedIn === "createChannel") {
      if (step === 0)
        return (
          <ChannelInfo state={state} setState={setState} errors={errors} />
        );
      if (step === 1) return <ChannelType state={state} setState={setState} />;
      if (step === 2 && state.visibility === "private")
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
    } else if (usedIn === "createWorkspace") {
      if (step === 0)
        return (
          <ChannelInfo
            usedIn={usedIn}
            state={workspaceData}
            setState={setWorkspaceData}
            errors={errors}
          />
        );
      if (step === 1)
        return (
          <AddavatarInWS
            usedIn={usedIn}
            state={workspaceData}
            setState={setWorkspaceData}
          />
        );
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
        {step < 2 && (
          <Button
            className="bg-transparent transition delay-150 duration-300 ease-in-out hover:bg-[#556cd6] hover:text-[#eee] border border-[#556cd6] text-[#556cd6]"
            onClick={handleNext}
          >
            Next
          </Button>
        )}
      </div>
      {step === 2 && usedIn === "createWorkspace" && (
        <Button
          onClick={handleSubmit}
          className="bg-[#008000] transition delay-150 duration-300 ease-in-out hover:bg-transparent hover:text-[#008000] border border-[#008000] text-[#fff]"
        >
          Finish
        </Button>
      )}
      {step === 1 &&
        usedIn === "createChannel" &&
        state.visibility === "public" && (
          <Button
            className="bg-[#008000] transition delay-150 duration-300 ease-in-out hover:bg-transparent hover:text-[#008000] border border-[#008000] text-[#fff]"
            onClick={handleSubmit}
          >
            Finish
          </Button>
        )}
    </div>
  );

  if (usedIn === "createChannel") {
    return (
      <Dialog open={open} onOpenChange={onOpenChange} initialFocus={dialogRef}>
        <DialogContent className="max-w-md  w-full">
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
          <h2 className="text-center text-xl font-bold text-[#4d3763]">
            Create a new Workspace
          </h2>
          <p className="text-center text-[#4d3763]">
            Enter the details and your workspace will be ready
          </p>
        </div>
        <StepIndicator step={step} />
        {renderStep()}
      </div>
      {renderFooterButtons()}
    </div>
  );
};

export default AddChannelDialog;
