import { useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { supabase } from "@/services/supabaseClient";
import { loginSchema } from "@/validation/authSchema";
import { FarsiQuote } from "../components/FarsiQuote";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/features/auth/authSlice";
const Login = () => {
  const dispatch = useDispatch();
  const { session, loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (session) {
      const sessionDetect = async () => {
        const lsRaw = localStorage.getItem("session");
        if (!lsRaw) return;
        const ls = JSON.parse(lsRaw);
        const {
          data: { user },
          error: checkerror,
        } = await supabase.auth.getUser();
        if (checkerror) console.log(checkerror);
        //if role == admin we want them to go to the dashboard page
        //otherwise check else condition
        if (user.role === "admin") {
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

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#020103] to-[#4d3763]">
      <div className="w-full md:w-1/2 flex items-center justify-center relative">
        <FarsiQuote />
        <style>{`
          .animate-fadeIn {
            animation: fadeInUp 1.2s cubic-bezier(0.4,0,0.2,1) both;
          }
          @keyframes fadeInUp {
            0% { opacity: 0; transform: translateY(40px); }
            100% { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
      <div className="w-full md:w-1/2 flex items-center justify-center py-12 px-4">
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginSchema}
          onSubmit={(values, { setSubmitting }) => {
            dispatch(loginUser(values));
            setSubmitting(true);
          }}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form
              className="w-full max-w-md p-8 rounded-xl shadow-2xl border border-white/20 backdrop-blur-md bg-white/10"
              aria-label="Login form"
              style={{
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              }}
            >
              <h2 className="text-2xl font-bold mb-8 text-center text-white dm-sans">
                Sign in to your account
              </h2>

              <div className="mb-5">
                <label
                  htmlFor="email"
                  className="block mb-2 text-white font-medium monts"
                >
                  Email
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple transition bg-white/20 text-white placeholder-white/60 backdrop-blur-sm ${
                    touched.email && errors.email
                      ? "border-red-400"
                      : "border-white/30"
                  }`}
                  placeholder="Enter your email"
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-300 text-xs mt-1"
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="password"
                  className="block mb-2 text-white font-medium monts"
                >
                  Password
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple transition bg-white/20 text-white placeholder-white/60 backdrop-blur-sm ${
                    touched.password && errors.password
                      ? "border-red-400"
                      : "border-white/30"
                  }`}
                  placeholder="Enter your password"
                />
                <ErrorMessage
                  name="password"
                  component="p"
                  className="text-red-300 text-xs mt-1"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-purple/80 backdrop-blur-sm text-white py-2 rounded-lg hover:bg-purple transition flex items-center justify-center font-semibold text-lg disabled:opacity-60 border border-white/20"
                disabled={loading || isSubmitting}
                aria-busy={loading}
              >
                {loading ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      ></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>

              {error && (
                <p className="text-red-300 text-sm mt-6 text-center">{error}</p>
              )}
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default Login;
