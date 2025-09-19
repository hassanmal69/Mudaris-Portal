import React, { useState } from "react";
import InviteWorkspaceUsers from "./steps/inviteWorkspaceUsers";
import WorkspaceInfo from "./steps/WorkspaceInfo";
import AddavatarInWS from "./steps/addAvatar";
import WorkspaceStepIndicator from "./steps/WorkspaceStepIndicator";
import { Button } from "@/components/ui/button";
import { workspaceInfoSchema } from "@/validation/authSchema";
import { supabase } from "@/services/supabaseClient";
import { useParams } from "react-router-dom";
const initialState = {
  name: "",
  description: "",
  avatarUrl: "",
  users: [],
};
const AddWorkspaceDialog = ({ open, onClose }) => {
  const [step, setStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [workspaceData, setWorkspaceData] = useState(initialState);
  const steps = ["Workspace Info", "Add Avatar", "Invite Users"];
  const resetWorkspaceState = (setWorkspaceData, setStep) => {
    setWorkspaceData(initialState);
    setStep(0);
  };
  const { adminId } = useParams();
  const getValidationSchema = () => {
    if (step === 0) return workspaceInfoSchema;
    if (step === 1) return;
    if (step === 2) return inviteUsersSchema;
    return null;
  };
  const validateStep = async () => {
    const schema = getValidationSchema();
    const currentData = workspaceData;

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
  // const handleNext = () => setStep((s) => s + 1);
  const handleBack = () => setStep((s) => s - 1);
  const handleClose = () => {
    resetWorkspaceState(setWorkspaceData, setStep);
    onClose();
  };
  const handleSubmit = async () => {
    const formData = workspaceData;
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
    setTimeout(() => resetWorkspaceState(setWorkspaceData, setStep), 300);

    console.log("Workspace created:", data);
    handleClose();
  };
  const renderStep = () => {
    if (step === 0)
      return (
        <WorkspaceInfo
          state={workspaceData}
          handleNext={handleNext}
          setState={setWorkspaceData}
          errors={errors}
        />
      );
    if (step === 1)
      return (
        <AddavatarInWS state={workspaceData} setState={setWorkspaceData} />
      );
    if (step === 2)
      return (
        <InviteWorkspaceUsers
          state={workspaceData}
          setState={setWorkspaceData}
          onSkip={handleSubmit}
          errors={errors}
        />
      );
  };

  if (!open) return null;

  return (
    <div className="dialog p-6 max-w-md mx-auto bg-white rounded shadow">
      <h2 className="text-center text-xl font-bold text-[#4d3763] mb-2">
        Create a new Workspace
      </h2>
      <p className="text-center text-[#4d3763] mb-4">
        Enter the details and your workspace will be ready
      </p>

      <WorkspaceStepIndicator step={step} steps={steps} />
      {renderStep()}

      <div className="flex justify-between mt-6">
        {step > 0 && (
          <Button variant="outline" onClick={handleBack}>
            Back
          </Button>
        )}
        {step < 2 && <Button onClick={handleNext}>Next</Button>}
        {step === 2 && <Button onClick={handleSubmit}>Finish</Button>}
      </div>
    </div>
  );
};

export default AddWorkspaceDialog;
