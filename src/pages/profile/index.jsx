import { Button } from "@/components/ui/button";
import VaulDrawer from "@/components/ui/drawer";
import React, { useState, useEffect } from "react";
// import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";

const Profile = () => {
  const { signOut, session } = useSelector((state) => state.auth);
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  // const user = session?.user;

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     const {
  //       data: { user },
  //       error,
  //     } = await supabase.auth.getUser();
  //     if (error) {
  //       console.error("Error fetching user data:", error);
  //     } else {
  //       setName(user.email);
  //       await getUserAvatar(user.id); // Load avatar from DB
  //     }
  //   };

  //   if (session) fetchUserData();
  // }, [session]);

  // const handleSignOut = async () => {
  //   const res = await signOut();
  //   if (res?.false) {
  //     throw new Error("Error in signout");
  //   }
  // };

  // const handleUpload = async (e) => {
  //   const file = e.target.files[0];
  //   if (!file || !user?.id) return;

  //   const fileExt = file.name.split(".").pop();
  //   const filePath = `${user.id}/profile.${fileExt}`;

  //   setUploading(true);

  //   const { error: uploadError } = await supabase.storage
  //     .from("pictures")
  //     .upload(filePath, file, { upsert: true });

  //   if (uploadError) {
  //     alert("Upload failed: " + uploadError.message);
  //     setUploading(false);
  //     return;
  //   }

  //   const { data: publicUrlData } = supabase.storage
  //     .from("pictures")
  //     .getPublicUrl(filePath);

  //   const publicUrl = publicUrlData.publicUrl;
  //   setImageUrl(publicUrl);

  //   // Update user record with avatar URL
  //   // const { error: updateError } = await supabase
  //   //   .from("user")
  //   //   .upsert([{ id: user.id, avatar: publicUrl }], { onConflict: ["id"] });
  //   const { error: checkerror } = await supabase.auth.updateUser({
  //     data: {
  //       avatar: publicUrl,
  //     },
  //   });

  //   if (updateError) {
  //     console.error("Error updating avatar in DB:", updateError);
  //   }

  //   setUploading(false);
  // };

  // const getUserAvatar = async (userId) => {
  //   // const { data, error } = await supabase
  //   //   .from("user")
  //   //   .select("avatar")
  //   //   .eq("id", userId)
  //   //   .single();
  //   const {
  //     data: { user },
  //     error,
  //   } = await supabase.auth.getUser();
  //   if (error) {
  //     console.error("Error getting avatar:", error);
  //   } else if (data?.avatar) {
  //     setImageUrl(data.avatar);
  //     console.log("data.avatar");
  //   }
  // };

  return (
    <VaulDrawer />
  );
};

export default Profile;
