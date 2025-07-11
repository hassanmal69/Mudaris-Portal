import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { supabase } from "@/services/supabaseClient";
import { useSessionRedirect } from "@/context/useSessionRedirect";
import quotesData from "@/assets/qoutes/Qoutes.json";
import { loginSchema } from "@/validation/authSchema";

const FarsiQuote = () => {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    if (quotesData && quotesData.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotesData.length);
      setQuote(quotesData[randomIndex]);
    }
  }, []);

  if (!quote) return null;

  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full px-6 animate-fadeIn"
      style={{ minHeight: "300px" }}
    >
      <blockquote className="text-3xl md:text-4xl lg:text-5xl font-semibold italic text-white text-center leading-relaxed font-serif">
        {`«${quote.quote}»`}
      </blockquote>
      <span className="mt-4 text-lg text-muted">— {quote.author}</span>
    </div>
  );
};

const Login = () => {
  useSessionRedirect();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (values, { setSubmitting }) => {
    setError("");
    setLoading(true);
    try {
      const { data, error: signInError } =
        await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });
      if (signInError) {
        setError("Invalid email or password. Please try again.");
        return;
      }
      // Session is managed by Supabase; redirection handled by hook
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
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
      {/* Section 2: Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center py-12 px-4">
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
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
