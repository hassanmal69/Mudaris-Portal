import { shallowEqual, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import EditProfile from "./editProfile.jsx";
import { useParams } from "react-router-dom";
import "../profile.css";
import { selectChannelsByUser } from "@/redux/features/channelMembers/channelMembersSlice.js";
import VaulDrawer from "@/components/drawer/index.jsx"

const ParentProfile = () => {
  const { workspace_id } = useParams();
  const {
    avatar_url: aUrl,
    fullName,
    email
  } = useSelector((state) => state.auth?.user?.user_metadata || {}, shallowEqual);
  const userId = useSelector((state) => (state.auth.user?.id), shallowEqual);
  const [avatarUrl, setAvatarUrl] = useState(aUrl);
  const channels = useSelector(
    selectChannelsByUser(userId, workspace_id),
    shallowEqual
  );

  useEffect(() => {
    setAvatarUrl(aUrl);
  }, [aUrl]);
  return (
    <VaulDrawer avatarUrl={avatarUrl} EditProfile={EditProfile} fullName={fullName} email={email} channels={channels} />
  )
}

export default React.memo(ParentProfile);
