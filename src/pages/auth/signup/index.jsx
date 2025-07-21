import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import StepFullName from "./components/FullName.jsx";
import StepContact from "./components/EmailAvatar.jsx";
import StepPassword from "./components/Password.jsx";
import { validationTokenInvite } from "@/utils/helper.js";

const Signup = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [step, setStep] = useState(0);
  const [wsId, setWsId] = useState("");
  const [groupID, setGroupId] = useState("");

  useEffect(() => {
    if (token) {
      (async () => {
        const invite = await validationTokenInvite(token);
        setWsId(invite.workspaceId);
        setGroupId(invite.groupId);
      })();
    }
  }, [token]);

  const handleNextFromContact = ({ avatarFile }) => {
    // Store avatarFile in Redux if needed
    setStep(2);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepFullName onNext={() => setStep(1)} />;
      case 1:
        return (
          <StepContact
            onNext={handleNextFromContact}
            onBack={() => setStep(0)}
          />
        );
      case 2:
        return (
          <StepPassword
            onBack={() => setStep(1)}
            token={token}
            wsId={wsId}
            groupID={groupID}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary to-primary p-8 flex items-center justify-center">
      {renderStep()}
    </div>
  );
};

export default Signup;
