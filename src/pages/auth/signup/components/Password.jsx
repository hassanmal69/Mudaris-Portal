import { Formik, Form, Field, ErrorMessage } from "formik";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { updateField, resetSignupForm } from "@/features/auth/signupSlice.js";
import { passwordSchema } from "@/validation/authSchema";
import { signupUser } from "@/features/auth/authSlice.js";
import { supabase } from "@/services/supabaseClient";
import { useNavigate } from "react-router-dom";
const Password = ({ onBack, token, invite }) => {
  const [error, setError] = useState();
  const { fullName } = useSelector((state) => state.signupForm);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleSubmit = async (values) => {
    try {
      setError(null);

      const { user } = await dispatch(
        signupUser({
          fullName,
          email: invite.email,
          password: values.password,
          token,
        })
      ).unwrap();
      if (!user?.id) throw new Error("user id missing after signup!");

      const { error: memberError } = await supabase
        .from("workspace_members")
        .insert([
          {
            user_id: user.id,
            workspace_id: invite.workspace_id,
            role: "user",
          },
        ]);

      if (memberError)
        throw new Error(`Failed to add to workspace: ${memberError}`);

      navigate(`/workspace/${invite.workspace_id}`);
    } catch (err) {
      setError(err.message || "An unexpected error occurred");
    }
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
              className="btn btn-secondary  bg-yellow-50 text-black py-1.5 px-6 rounded-2xl text-l font-semibold"
            >
              Back
            </button>
            <button
              type="submit"
              className="btn btn-primary bg-purple py-1.5 px-6 rounded-2xl text-l font-semibold"
            >
              Submit
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default Password;
