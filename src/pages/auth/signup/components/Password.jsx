import { Formik, Form, Field, ErrorMessage } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { passwordSchema } from "@/validation/authSchema.js";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/services/supabaseClient";
import { addToast } from "@/redux/features/toast/toastSlice";
import { sessionDetection } from "@/redux/features/auth/authSlice";
const Password = ({ onBack, token, invite, file }) => {
  const dispatch = useDispatch()
  const { fullName } = useSelector((state) => state.signupForm);
  const navigate = useNavigate();
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = reject;
    });

  const handleSubmit = async (values) => {
    try {
      const { data, error } = await supabase.functions.invoke(
        "signup-user",
        {
          body: {
            fullName,
            email: invite.email,
            password: values.password,
            token,
            workspaceId: invite.workspace_id,
            avatarBase64: file ? await toBase64(file) : null,
            allowedChannelsFromInvite: invite.allowedChannels,
          },
        }
      );
      // now session exists

      if (error) {
        dispatch(
          addToast({
            message: "Signup failed. Try again.",
            type: "error",
          })
        );
        return;
      }

const { error:loginEror } = await supabase.auth.signInWithPassword({
  email: invite.email,
  password: values.password,
});
if (loginEror) {
  dispatch(addToast("Login failed. Please try again."));
  return;
}
      navigate(data.redirect);
    } catch (error) {
      throw new Error(error)
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
            <Field type="password" name="password" className="w-full p-2 border rounded" />
            <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onBack}
              className="btn btn-secondary bg-yellow-50 text-black py-1.5 px-6 rounded-2xl text-l font-semibold"
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
