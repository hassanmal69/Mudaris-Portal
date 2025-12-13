import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema } from "@/validation/authSchema";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/redux/features/auth/authSlice";
import bgImg from "@/assets/images/GrowthIcon.png";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

const Login = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || null;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, session } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false)
  useEffect(() => {
    if (session) {
      navigate(from || `/dashboard/${session.user.id}`, {
        replace: true,
      });
    }
  }, [session, navigate, from]);

  if (loading) {
    return (
      <p className="text-9xl text-center flex w-full h-full items-center justify-center">
        Loading
      </p>
    );
  }
  return (
    <section className="w-full h-screen bg-(--background) flex items-center justify-center">
      <main className="max-w-2xl w-fit min-w-2xs p-7 rounded bg-(--card) flex items-center justify-center border border-(--border)">
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
              className="flex flex-col items-center  gap-2"
              aria-label="Login form"
            >
              <img src={bgImg} alt="logo" className="w-[50px] h-[50px] " />
              <h2 className="text-3xl text-center font-bold text-(--foreground) dm-sans">
                Mudaris Academey{" "}
              </h2>
              <p className="text-(--primary-foreground)">
                Enter your account details
              </p>
              <div className="w-full">
                <div className="mb-5">
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`w-full border p-3 text-(--primary-foreground) bg-(--input) border-(--border) rounded focus:outline-none focus:ring-2 focus:ring-purple transition border-b-2 backdrop-blur-sm ${touched.email && errors.email
                      ? "border-(--destructive)"
                      : ""
                      }`}
                    placeholder="Email"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-(--destructive) text-xs mt-1"
                  />
                </div>

                <div className="mb-6">
                  <div className="relative flex justify-end items-center">
                    <Field
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      className={` border p-3 w-full  text-(--primary-foreground) bg-(--input) border-(--border) rounded focus:outline-none focus:ring-2 focus:ring-purple transition border-b-2 backdrop-blur-sm ${touched.password && errors.password
                        ? "border-(--destructive)"
                        : ""
                        }`}
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      className="text-white absolute right-3"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-(--destructive) text-xs mt-1"
                  />
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading}
                aria-busy={loading}
                variant={"success"}
                className={"w-full h-[45px]"}
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
              </Button>
              <div className="text-(--foreground) text-center text-xs">
                <p>
                  By continuing, you acknowledge Anthropic's
                  <span className="text-blue-500 hover:underline cursor-pointer">
                    <Link to="/privacypolicy"> Privacy Policy and agree</Link>
                  </span>
                </p>
                <p>to get occasional product update and promotional emails.</p>
              </div>
            </Form>
          )}
        </Formik>
      </main>
    </section>
  );
};

export default Login;
