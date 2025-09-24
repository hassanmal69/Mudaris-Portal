import { useEffect, useState } from "react";
import StepFullName from "./components/FullName.jsx";
import StepContact from "./components/EmailAvatar.jsx";
import StepPassword from "./components/Password.jsx";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/services/supabaseClient.js";
import bgImg from "@/assets/images/mudaris.jpg";

const Signup = () => {
  const [step, setStep] = useState(0);
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();
  const [invite, setInvite] = useState(null);
  const [error, setError] = useState();
  const [wsId, setWsId] = useState();
  const handleNextFromContact = ({ avatarFile }) => {
    // Store avatarFile in Redux if needed
    setStep(2);
  };

  useEffect(() => {
    async function varifyInvite() {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("token", token)
        .single();

      if (error || !data) {
        setError("invalid invitation links");
        return;
      }

      if (data.used) {
        setError("This invitation link has already been used!");
        return;
      }

      if (new Date(data.expires_at) < new Date()) {
        setError("The invitation link has expired!");
        return;
      }

      setInvite(data);
      setWsId(data.workspace_id);
    }

    if (token) {
      varifyInvite();
    } else {
      setError("No invitation token provided!");
    }
  }, [token]);

  const renderStep = () => {
    switch (step) {
      case 0:
        return <StepFullName onNext={() => setStep(1)} />;
      case 1:
        return (
          <StepContact
            onNext={handleNextFromContact}
            onBack={() => setStep(0)}
            invite={invite}
          />
        );
      case 2:
        return (
          <StepPassword
            onBack={() => setStep(1)}
            token={token}
            invite={invite}
            workspace_id={wsId}
            signUpError={error}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen overflow-hidden relative w-full md:flex-row bg-black p-8">
      <div
        className="w-full h-full opacity-75 absolute bg-contain bg-no-repeat bg-center blur-lg animate-pulse"
        style={{ backgroundImage: `url(${bgImg})` }}
      ></div>
      <div className="w-[90%] flex flex-col items-center h-full justify-between md:flex-row relative">
        <h1 className="h-[30%] text-6xl font-extrabold tracking-[-0.015em] text-right w-[50%] bg-gradient-to-br from-white via-[#d9c0ff] to-white bg-clip-text text-transparent">
          تا زمانی که برای رؤیاهایت تلاش نکنی، زندگی‌ات تغییر نخواهد کرد
        </h1>
        <div className=" w-full max-w-md flex flex-col gap-2 p-8 rounded-xl shadow-2xl border border-white/20 backdrop-blur-md bg-white/10 text-white">
          <h1 className="text-center text-2xl font-bold  bg-gradient-to-br from-[#9855ff] via-purple to-white bg-clip-text text-transparent">
            Welcome to Mudaris Academy
          </h1>
          <h2 className="text-center text-2xl font-bold  ">
            Let's Create your future
          </h2>
          {renderStep()}
        </div>
      </div>
    </div>
  );
};

export default Signup;
//previous css important things in here from hassan
//bg-gradient-to-br from-[#020103] to-[#4d3763]