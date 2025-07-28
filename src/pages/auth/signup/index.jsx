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

  // useEffect(() => {
  //   if (token) {
  //     (async () => {
  //       const invite = await validationTokenInvite(token);
  //       setWsId(invite.workspaceId);
  //       setGroupId(invite.groupId);
  //     })();
  //   } else return console.log('tokenisnot ')
  // }, [token]);

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
    <div className="h-screen w-full md:flex-row bg-gradient-to-br from-[#020103] to-[#4d3763] p-8">
      <div className="w-[90%] flex flex-col items-center h-full justify-between md:flex-row relative">
        <h1 className="h-[30%] text-6xl font-extrabold tracking-[-0.015em] text-right w-[50%] bg-gradient-to-br from-[#9855ff] via-white to-white bg-clip-text text-transparent">
          تا زمانی که برای رؤیاهایت تلاش نکنی، زندگی‌ات تغییر نخواهد کرد</h1>
        <div className=" w-full max-w-md p-8 rounded-xl shadow-2xl border border-white/20 backdrop-blur-md bg-white/10 text-white">
          <h1 className="text-center text-xl font-bold ">Welcome to Mudaris Academy</h1>
          <h2 className="text-center text-xl font-bold ">Create your account</h2>
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Signup;
