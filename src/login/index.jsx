import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../context/authContext";
import axios from "axios";
import { supabase } from "../supabaseClient";

const Login = () => {
  const { setSession, session } = UserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [worksId, setworksId] = useState("");
  const [grId, setgrId] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (session) {
      const sessionDetect = async () => {
        const lsRaw = localStorage.getItem("session");
        if (!lsRaw) return;

        const ls = JSON.parse(lsRaw);
        const { data: checkAdmin, error: checkerror } = await supabase
          .from("user")
          .select("role")
          .eq("email", ls.user?.email)
          .single();
        console.log("checkAdmin role in login.jsx ->", checkAdmin.role);
        console.log("checkAdmin in login.jsx ->", checkAdmin);
        if (checkerror) console.log(checkerror);
        if (checkAdmin.role === "admin") {
          navigate("/dashboard");
        } else {
          const { data: wsData, error: wsError } = await supabase
            .from("invitations")
            .select("workspaceId,groupId")
            .eq("email", ls.user?.email);

          if (wsError) {
            console.log("Error fetching invitation:", wsError);
            return;
          }

          if (wsData && wsData.length > 0) {
            const WsId = wsData[0].workspaceId;
            const gId = wsData[0].groupId;
            setgrId(gId);
            setworksId(WsId);
            navigate(`/workspace/${WsId}/group/${gId}`);
          } else {
            console.log("No invitation found for this email");
          }
        }
      };

      sessionDetect();
    }
  }, [session, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(
        "/api/signin",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const session = res.data?.session;
      localStorage.setItem("session", JSON.stringify(session));
      setSession(session);
      navigate(`/workspace/${worksId}/group/${grId}`);
    } catch (error) {
      console.error("here are error in login in login.jsx", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="enter username or email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="enter password"
        />
        <button type="submit" disabled={loading}>
          submit
        </button>
      </form>
      {error && <p>error coming in jsx of login{error}</p>}
    </div>
  );
};

export default Login;
