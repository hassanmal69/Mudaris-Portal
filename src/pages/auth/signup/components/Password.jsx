import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { passwordSchema } from "@/validation/authSchema.js";
import { signupUser } from "@/features/auth/authSlice.js";
import { useNavigate } from "react-router-dom";
import {
  addWorkspaceMember,
} from "@/features/workspaceMembers/WorkspaceMembersSlice.js";
import { supabase } from "@/services/supabaseClient";

const Password = ({ onBack, token, invite, file }) => {
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
        })
      ).unwrap();
      if (!user?.id) throw new Error("user id missing after signup!");
      const { error: tokenUsed } = await supabase
        .from("invitations")
        .update({ used: true })
        .eq("token", token);
      if (tokenUsed) {
        console.log('error coming in token update', tokenUsed);
      }
      // Insert workspace member using Redux thunk

      const result = await dispatch(
        addWorkspaceMember({
          userId: user.id,
          workspaceId: invite.workspace_id || null,
          role: "user",
        })
      ).unwrap();

      if (result.error)
        throw new Error(`Failed to add to workspace: ${result.error}`);

      // Fetch workspace members from Redux for this workspace
      // dispatch(fetchWorkspaceMembers(invite.workspace_id));
      if (!file) {
        throw new Error("No avatar file selected");
      }
      const userId = user.id;
      const fileExt = file.name.split(".").pop();
      const newFilePath = `pictures/avatar/${userId}-${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("media")
        .upload(newFilePath, file, { upsert: true });

      if (uploadError) {
        console.error("Error uploading file:", uploadError);
      }

      const {
        data: { publicUrl },
      } = await supabase.storage.from("media").getPublicUrl(newFilePath);
      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });
      const {
        error: { profileUpdateError }
      } = await supabase.from('profiles').insert({
        full_name: user?.user_metadata.fullName,
        avatar_url: user?.user_metadata.avatar_url
      }).eq("id", userId)
      if (profileUpdateError) {
        throw new Error(profileUpdateError)
      }
      if (updateError) {
        console.error("Error updating avatar URL:", updateError);
        return;
      }

      navigate(`/dashboard/${user?.id}`);
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
