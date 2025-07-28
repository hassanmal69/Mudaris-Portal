import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { updateField, resetSignupForm } from "@/features/auth/signupSlice.js";
import { passwordSchema } from "@/validation/authSchema";
import { signupUser } from '@/features/auth/authSlice.js'
import { supabase } from "@/services/supabaseClient";
import { useNavigate } from "react-router-dom";
const Password = ({ onBack, token, wsId, groupID }) => {
  const { fullName, email } = useSelector((state) => state.signupForm);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (values) => {
    dispatch(updateField({ field: "password", value: values.password }));
    console.log({
      fullName,
      email,
      password: values.password,
      token,
      wsId,
      groupID,
    });
    const signUpObj = {
      fullName,
      email,
      password: values.password,
      token,
      wsId,
      groupID,
    }
    dispatch(signupUser(signUpObj));
    dispatch(resetSignupForm());
    alert("Signup complete!");
    navigate('/dashboard')
  };

  return (
    <Formik
      initialValues={{ password: "" }}
      validationSchema={passwordSchema}
      onSubmit={handleSubmit}
    >
      {() => (
        <Form className="space-y-4 rounded-md">
          <h2 className="text-lg font-bold">Step 3: Password</h2>
          <div>
            <label>Password</label>
            <Field
              type="password"
              name="password"
              className="w-full p-2 border rounded"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onBack}
              className="btn btn-secondary"
            >
              Back
            </button>
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Password;
