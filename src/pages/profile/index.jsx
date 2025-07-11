import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { UserAuth } from "../../context/authContext";

const Profile = () => {
  const { signOut, session } = UserAuth();
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const user = session?.user;

  useEffect(() => {
    const fetchUserData = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user data:", error);
      } else {
        setName(user.email);
        await getUserAvatar(user.id); // Load avatar from DB
      }
    };

    if (session) fetchUserData();
  }, [session]);

  const handleSignOut = async () => {
    const res = await signOut();
    if (res?.false) {
      throw new Error("Error in signout");
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user?.id) return;

    const fileExt = file.name.split(".").pop();
    const filePath = `${user.id}/profile.${fileExt}`;

    setUploading(true);

    const { error: uploadError } = await supabase.storage
      .from("pictures")
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      alert("Upload failed: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicUrlData } = supabase.storage
      .from("pictures")
      .getPublicUrl(filePath);

    const publicUrl = publicUrlData.publicUrl;
    setImageUrl(publicUrl);

    // Update user record with avatar URL
    const { error: updateError } = await supabase
      .from("user")
      .upsert([{ id: user.id, avatar: publicUrl }], { onConflict: ["id"] });

    if (updateError) {
      console.error("Error updating avatar in DB:", updateError);
    }

    setUploading(false);
  };

  const getUserAvatar = async (userId) => {
    const { data, error } = await supabase
      .from("user")
      .select("avatar")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error getting avatar:", error);
    } else if (data?.avatar) {
      setImageUrl(data.avatar);
      console.log("data.avatar");
    }
  };

  return (
    <div className="text-white">
      <h2>{name}</h2>
      <h3>Upload Profile Picture</h3>
      <input type="file" accept="image/*" onChange={handleUpload} />
      {uploading && <p>Uploading...</p>}

      {imageUrl && (
        <img
          src={imageUrl}
          alt="Profile"
          className="rounded-full mt-4"
          width={150}
          height={150}
        />
      )}

      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
};

export default Profile;
