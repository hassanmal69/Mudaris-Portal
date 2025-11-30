import { Formik, Form, Field, ErrorMessage } from "formik";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { passwordSchema } from "@/validation/authSchema.js";
import { signupUser } from "@/redux/features/auth/authSlice.js";
import { useNavigate } from "react-router-dom";
import { addWorkspaceMember } from "@/redux/features/workspaceMembers/WorkspaceMembersSlice.js";
import { supabase } from "@/services/supabaseClient";
import { fetchChannels } from "@/redux/features/channels/channelsSlice";
import { addChannelMembersonSignUp } from "@/redux/features/channelMembers/channelMembersSlice";

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

      if (!user?.id) throw new Error("User ID missing after signup!");
      const userId = user.id;
      let avatarUrlLocal = null;

      // 2. UPLOAD AVATAR (IF PROVIDED)
      if (file) {
        const fileExt = file.name.split(".").pop();
        const newFilePath = `pictures/avatar/${userId}-${Date.now()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from("media")
          .upload(newFilePath, file, { upsert: true });

        if (uploadError) throw new Error("Avatar upload failed.");

        const { data: { publicUrl } } = await supabase.storage
          .from("media")
          .getPublicUrl(newFilePath);

        avatarUrlLocal = publicUrl;
      }

      // 3. UPDATE PROFILE
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          avatar_url: avatarUrlLocal,
          role: "user",
        })
        .eq("id", userId);

      if (profileUpdateError) throw new Error("Profile update failed.");

      // 4. MARK TOKEN USED
      await supabase
        .from("invitations")
        .update({ used: true })
        .eq("token", token);

      // 5. ADD TO WORKSPACE
      await dispatch(
        addWorkspaceMember({
          userId,
          workspaceId: invite.workspace_id,
          role: "user",
        })
      ).unwrap();

      // 6. FETCH CHANNELS
      const { payload: channels } = await dispatch(
        fetchChannels(invite.workspace_id)
      );

      let filteredChannels = channels.filter(
        (channel) => channel.visibility === "public"
      );

      // 7. ADD PRIVATE ALLOWED CHANNELS
      const { data: invitedData } = await supabase
        .from("invitations")
        .select("allowedChannels")
        .eq("token", token)
        .single();

      if (invitedData?.allowedChannels?.length) {
        const privateChannels = invitedData.allowedChannels
          .map((cid) => channels.find((c) => c.id === cid))
          .filter(Boolean);

        filteredChannels = [...filteredChannels, ...privateChannels];
      }

      // 8. ADD USER TO CHANNELS
      for (const channel of filteredChannels) {
        await dispatch(
          addChannelMembersonSignUp({
            channelId: channel.id,
            userId,
          })
        );
      }

      // 9. REDIRECT
      navigate(`/dashboard/${userId}`);
    } catch (err) {
      console.error(err);
      setError(err.message || "Unexpected error occurred.");
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
