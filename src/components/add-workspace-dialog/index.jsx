import React, { useState } from "react";
import InviteWorkspaceUsers from "./steps/InviteWorkspaceUsers.jsx";
import WorkspaceInfo from "./steps/WorkspaceInfo.jsx";
import AddavatarInWS from "./steps/addAvatar.jsx";
import WorkspaceStepIndicator from "./steps/WorkspaceStepIndicator.jsx";
import { Button } from "@/components/ui/button";
import { workspaceInfoSchema } from "@/validation/authSchema.js";
import { useParams } from "react-router-dom";

import { useDispatch } from "react-redux";
import { createWorkspace } from "@/features/workspace/workspaceSlice.js";
import { supabase } from "@/services/supabaseClient.js";
const initialState = {
  name: "",
  description: "",
  avatarFile: "",
  users: [],
};
const AddWorkspaceDialog = ({ open, onClose }) => {
  const dispatch = useDispatch();
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
    let { name, description, avatarFile } = formData;
    dispatch(
      createWorkspace({
        name,
        description,
        avatarFile,
        adminId,
      })
    )
      .unwrap()
      .then((data) => {
        console.log("workspace created", data);
        setTimeout(() => resetWorkspaceState(setWorkspaceData, setStep), 300);
        handleClose();
      })
      .catch((err) => {
        console.error("Failed to create workspace:", err);
      });
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

      // Use state directly instead of undefined formData
      const { name, description, avatarFile, users } = workspaceData;

      // 1. Create the workspace first
      const workspace = await dispatch(
        createWorkspace({
          name,
          description,
          avatarFile,
          adminId,
        })
      ).unwrap();

      console.log("workspace created", workspace);

      // // 2. Now send the invitations with the new workspace_id
      const res = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-invite`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            workspace_id: workspace.id,
            emails: users,
            workspaceName: workspace?.workspace_name || "Workspace",
          }),
        }
      );

      const result = await res.json();
      console.log("invite response ->", result);

      if (!res.ok) {
        console.error("❌ Failed:", result);
        alert("Server error: " + JSON.stringify(result));
        return;
      }

      const failed = result.results.filter((r) => r.error);
      if (failed.length > 0) {
        alert(
          "Some invitations failed:\n" +
            failed.map((f) => `${f.email}: ${f.error}`).join("\n")
        );
      } else {
        alert("✅ All invitations sent successfully!");
      }

      setTimeout(() => resetWorkspaceState(setWorkspaceData, setStep), 300);
      handleClose();
    } catch (err) {
      console.error("⚠️ Unexpected error:", err);
      alert("Unexpected error while sending invitations.");
    }
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
    <div className="dialog p-6 max-w-md mx-auto bg-black text-[#c7c7c7] rounded shadow">
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
          <Button className="bg-red-700" onClick={handleBack}>
            Back
          </Button>
        )}
        {step < 2 && <Button onClick={handleNext}>Next</Button>}
        {step === 2 && (
          <Button className="bg-green-950" onClick={sendEmail}>
            Finish
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddWorkspaceDialog;

// {
//     "id": "c8a0ace1-cb42-4bd5-9edd-2e15a565236f",
//     "created_at": "2025-09-20T18:02:50.072592+00:00",
//     "workspace_name": "test",
//     "owner_id": "99cb0492-a3f0-4f1d-ac52-b6acc73e0a7e",
//     "avatar_url": null,
//     "description": "this is test"
// }
