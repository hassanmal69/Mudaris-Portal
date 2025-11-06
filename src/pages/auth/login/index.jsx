import { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginSchema } from "@/validation/authSchema";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "@/features/auth/authSlice";
import bgImg from "@/assets/images/GrowthIcon.png";
import { useLocation } from "react-router-dom";

const Login = () => {
  const location = useLocation();
  const from = location.state?.from?.pathname || null;
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { session } = useSelector((state) => state.auth);
  const [pageloading, setpageloading] = useState(false);
  const handletogle = () => {
    const root = document.documentElement;

    if (mode === 'dark') {
      root.classList.add('light')
      localStorage.setItem('theme', 'light')
      console.log(localStorage.getItem('theme'));
    }
  }
  useEffect(() => {
    const sessionDetect = async () => {
      if (!session || session === undefined) setpageloading(true);
      if (session) {
        if (from) {
          navigate(from, { replace: true });
        } else {
          navigate(`/dashboard/${session?.user?.id}`, { replace: true });
        }
      }
    };

    sessionDetect();
  }, [navigate, from, session]);

  return pageloading ? (

    <div className="font-poppins flex relative flex-col md:flex-row bg-[linear-gradient(20.82deg,#220E3D_11.13%,#5B25A3_88.87%)]">
      <div className="text-white flex flex-col justify-center items-center w-[70%]">
        <div className="flex flex-col items-center text-left w-full h-full">
          <div className="flex flex-col gap-2">
            <h1
              className=" font-extrabold text-[60px] leading-[70px]">
              <span className="font-semibold text-[40px] leading-[70px]">Welcome to </span> <br />
              Mudaris Academy <br /> Student Portal</h1>
            <p className="font-poppins font-medium text-[16px]">Login to access your account</p>
          </div>
        </div>
        <img
          className="w-[70%]"
          src={bgImg}
          alt="Mudaris Academy logo" />
      </div>
      <div className="w-full  md:w-1/2 flex items-center justify-center bg-[#2A2C32] text-white py-12">
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
              className="w-1/2 flex flex-col items-start gap-2"
              aria-label="Login form"
            >
              <h2 className="text-[48px] font-bold text-white dm-sans">
                Sign in
              </h2>
              <p className="opacity-70">Enter your account details</p>
              <div className="w-full">
                <div className="mb-5">
                  <Field
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={`w-full py-2 focus:outline-none focus:ring-2 focus:ring-purple transition border-b-2 text-white placeholder-white/60 backdrop-blur-sm ${touched.email && errors.email
                      ? "border-red-400"
                      : "border-b-white/30"
                      }`}
                    placeholder="Email"
                  />
                  <ErrorMessage
                    name="email"
                    component="p"
                    className="text-red-300 text-xs mt-1"
                  />
                </div>

                <div className="mb-6">
                  <Field
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className={`w-full py-2 border-b-2 focus:outline-none focus:ring-2 focus:ring-purple transition text-white placeholder-white/60 backdrop-blur-sm ${touched.password && errors.password
                      ? "border-red-400"
                      : "border-white/30"
                      }`}
                    placeholder="Password"
                  />
                  <ErrorMessage
                    name="password"
                    component="p"
                    className="text-red-300 text-xs mt-1"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full font-poppins  bg-purple/80 bg-[#58259C] backdrop-blur-sm text-white py-2 rounded-lg hover:bg-purple transition flex items-center justify-center font-normal text-[16px] disabled:opacity-60 border border-white/20"
                disabled={loading }
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
    </div >
  ) : (
    <p className="text-9xl text-center flex w-full h-full items-center justify-center">
      Loading
    </p>
  );
};

export default Login;
