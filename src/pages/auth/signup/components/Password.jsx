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
      if (!user?.id) throw new Error("user id missing after signup!");
      const { error: tokenUsed } = await supabase
        .from("invitations")
        .update({ used: true })
        .eq("token", token);
      if (tokenUsed) {
        console.log("error coming in token update", tokenUsed);
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
      //now we have to add a user in all Public Group Members
      const channelsAre = await dispatch(fetchChannels(invite.workspace_id));
      let filteredChannels = await channelsAre?.payload.filter(
        (channel) => channel.visibility === "public"
      );
      const userId = user.id;
      //we got token here then we put token in invitaton then
      // we get allowed channel
      const { data: allowedChannel, error: allowedChannelError } =
        await supabase
          .from("invitations")
          .select("allowedChannels")
          .eq("token", token);
      if (allowedChannelError) {
        throw new Error(allowedChannelError);
      }
      const privateAllowedChannel = [];
      // console.log('ye rha console', allowedChannel);
      // console.log('ye rha console', allowedChannel[0]);
      // console.log('ye rha console', allowedChannel[0].allowedChannels);
      for (const m of allowedChannel[0].allowedChannels) {
        let gotChannel = await channelsAre?.payload.find(
          (channel) => channel.id === m
        );
        if (gotChannel) {
          privateAllowedChannel.push(gotChannel);
        }
      }

      if (allowedChannel[0].allowedChannels) {
        filteredChannels = [...filteredChannels, ...privateAllowedChannel];
      }
      console.log(filteredChannels);
      for (const m of filteredChannels) {
        console.log("data is sending", m);
        const sendingData = await dispatch(
          addChannelMembersonSignUp({ channelId: m.id, userId })
        );
        console.log("getting data is", sendingData);
      }

      if (file) {
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
        const { error: profileUpdateError } = await supabase
          .from("profiles")
          .update({
            full_name: fullName,
            avatar_url: publicUrl,
            role: "user",
          })
          .eq("id", userId);

        if (profileUpdateError) {
          throw new Error(profileUpdateError);
        }
        if (updateError) {
          console.error("Error updating avatar URL:", updateError);
          return;
        }
      }
      console.log(fullName);
      const { error: profileUpdateError } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
        })
        .eq("id", userId);
      if (profileUpdateError) throw new Error(profileUpdateError);
      if (!profileUpdateError) {
        navigate(`/dashboard/${user?.id}`);
      }
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
