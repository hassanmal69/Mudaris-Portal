import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { Link } from "react-router-dom";
import { UserAuth } from "../../../context/authContext";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import { signupSchema } from "@/validation/authSchema";
import { FarsiQuote } from "../components/FarsiQuote";
import { handleSignup, validationTokenInvite } from "../../../services/auth";
const SignUp = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setSession } = UserAuth();
  const [wsId, setWsId] = useState("");
  const [groupID, setGroupId] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");

  useEffect(() => {
    if (token) {
      (async () => {
        try {
          const invite = await validationTokenInvite(token);
          setInviteEmail(invite.email);
          setWsId(invite.workspaceId);
          setGroupId(invite.groupId);
        } catch (error) {
          console.error("Error validating token:", error);
          setError("Invalid or expired token");
        }
      })();
    }
  }, [token]);

  const handleSubmit = async (values, forkmikHelpers) => {
    handleSignup({
      values,
      token,
      setLoading,
      setError,
      setSession,
      navigate,
      wsId,
      groupID,
      ...forkmikHelpers,
    });
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-secondary to-primary">
      {/* Section 1: Quote */}
      <div className="w-full md:w-1/2 flex items-center justify-center relative">
        <FarsiQuote />
        {/* Fade-in animation */}
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

      {/* Section 2: Signup Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center py-12 px-4">
        <Formik
          initialValues={{
            name: "",
            email: inviteEmail || "",
            password: "",
            confirmPassword: "",
          }}
          validationSchema={signupSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          {({ touched, errors, isSubmitting }) => (
            <Form
              className="w-full max-w-md p-8 rounded-xl shadow-2xl border border-white/20 backdrop-blur-md bg-white/10"
              aria-label="Signup form"
              style={{
                boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
              }}
            >
              <h2 className="text-2xl font-bold mb-8 text-center text-white dm-sans">
                Create your account
              </h2>

              <div className="mb-5">
                <label
                  htmlFor="name"
                  className="block mb-2 text-white font-medium monts"
                >
                  Full Name
                </label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple transition bg-white/20 text-white placeholder-white/60 backdrop-blur-sm ${
                    touched.name && errors.name
                      ? "border-red-400"
                      : "border-white/30"
                  }`}
                  placeholder="Enter your full name"
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="text-red-300 text-xs mt-1"
                />
              </div>

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
                  disabled={!!inviteEmail}
                />
                <ErrorMessage
                  name="email"
                  component="p"
                  className="text-red-300 text-xs mt-1"
                />
              </div>

              <div className="mb-5">
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
                  autoComplete="new-password"
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

              <div className="mb-6">
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-white font-medium monts"
                >
                  Confirm Password
                </label>
                <Field
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple transition bg-white/20 text-white placeholder-white/60 backdrop-blur-sm ${
                    touched.confirmPassword && errors.confirmPassword
                      ? "border-red-400"
                      : "border-white/30"
                  }`}
                  placeholder="Confirm your password"
                />
                <ErrorMessage
                  name="confirmPassword"
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
                    Creating account...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>

              {error && (
                <p className="text-red-300 text-sm mt-6 text-center">{error}</p>
              )}

              <p className="text-white/80 text-sm mt-6 text-center">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-purple hover:text-white transition"
                >
                  Sign in
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignUp;
