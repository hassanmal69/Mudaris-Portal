import axios from "axios";
import { supabase } from "./supabaseClient.js"; // Adjust the import path as necessary
export const handleSignup = async ({
  values,
  token,
  setLoading,
  setError,
  setSession,
  setSubmitting,
  navigate,
  wsId,
  groupID,
}) => {
  setLoading(true);
  setError("");

  try {
    const response = await axios.post(
      "/api/signup",
      {
        // name: values.name,
        email: values.email,
        password: values.password,
        token,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const { session, error: signUpError } = response.data;
    if (signUpError) {
      setError(signUpError.message || "Signup failed");
      return;
    }
    localStorage.setItem("session", JSON.stringify(session));
    setSession(session);
    navigate(`/workspace/${wsId}/group/${groupID}`);

    console.log("Signup successful:", session);

    if (wsId && groupID) {
      navigate(`/workspace/${wsId}/group/${groupID}`);
    } else {
      navigate("/dashboard");
    }
  } catch (err) {
    const errorMessage =
      err.response?.data?.message || err.message || "Signup failed";

    console.error("Signup error:", err.message);
    setError(errorMessage);
  } finally {
    setLoading(false);
    setSubmitting(false);
  }
};

export const validationTokenInvite = async (token) => {
  const res = await axios.post("/api/inviteValidation", {
    token: token,
  });
  return res.data?.data?.[0] || null;
};

export const handleLogin = async ({
  setLoading,
  values,
  setSession,
  setWorksId,
  setGrId,
  setSubmitting,
  navigate,
  setError,
}) => {
  setLoading(true);
  try {
    const res = await axios.post(
      "/api/signin",
      {
        email: values.email,
        password: values.password,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const session = res.data?.session;
    if (!session) {
      throw new Error("Login failed, no session returned");
    }
    localStorage.setItem("session", JSON.stringify(session));
    setSession(session);

    // const userEmail = session?.user?.email;
    // if (!userEmail) {
    //   throw new Error("Login failed, no user email found in session");
    // }
    // console.log("User email:", userEmail);
    // //Getting user role
    // const { data: checkAdmin, error: checkError } = await supabase
    //   .from("user")
    //   .select("role")
    //   .eq("email", userEmail)
    //   .single();
    // if (checkError) {
    //   throw new Error("Error fetching user role: " + checkError.message);
    // }
    // if (checkAdmin?.role === "admin") {
    //   navigate("/dashboard");
    //   return;
    // }
    // // if not admin, check for workspace invitation
    // const { data: wsdata, error: wsError } = await supabase
    //   .from("invitations")
    //   .select("workspaceId, groupId")
    //   .eq("email", userEmail);
    // if (wsError) {
    //   throw new Error(
    //     "Error fetching workspace invitation: " + wsError.message
    //   );
    // }

    // if (wsdata?.length > 0) {
    //   const wsId = wsdata[0].workspaceId;
    //   const groupId = wsdata[0].groupId;

    //   setWorksId(wsId);
    //   setGrId(groupId);
    //   navigate(`/workspace/${wsId}/group/${groupId}`);
    // } else {
    //   throw new Error("No workspace invitation found for this email");
    // }
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || "Login failed";
    setError(errorMessage);
    console.error("Login error:", errorMessage);
  } finally {
    setLoading(false);
    setSubmitting(false);
  }
};
