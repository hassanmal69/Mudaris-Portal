import { supabase } from "@/services/supabaseClient";
import React, { useEffect, useId, useState } from "react";
import { useSelector } from "react-redux";
import { ImagePlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.jsx";

const EditProfile = () => {
  const { session } = useSelector((state) => state.auth);
  const [file, setFile] = useState(null);
  const [name, setName] = useState(session.user?.user_metadata?.fullName);
  const [displayName, setDisplayName] = useState(
    session.user?.user_metadata.displayName
  );
  const [publicUrl, setPublicUrl] = useState(undefined);
  const [sessionAvatarUrl, setSessionAvatarUrl] = useState(
    session.user.user_metadata.avatar_url
  );
  const id = useId();
  const editProfileOpen = useSelector(
    (state) => state?.profile?.editProfileOpen
  );
  useEffect(() => {
    setSessionAvatarUrl(session.user.user_metadata.avatar_url);
  }, [session]);

  const handleSave = async () => {
    // Update names
    const { error } = await supabase.auth.updateUser({
      data: { fullName: name, displayName: displayName },
    });
    if (error) {
      console.error("Error updating user info", error);
      return;
    }

    // If picture selected → upload
    if (file) {
      await handleEditPic();
    }

    alert("Profile updated successfully!");
  };

  const handleEditPic = async () => {
    const userId = session.user.id;
    const fileExt = file.name.split(".").pop();
    const newFilePath = `pictures/avatar/${userId}-${Date.now()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from("media")
      .upload(newFilePath, file, { upsert: true });

    if (uploadError) {
      console.error("Error uploading file:", uploadError);
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(newFilePath);

    // Update user metadata
    const { error: updateError } = await supabase.auth.updateUser({
      data: { avatar_url: publicUrl },
    });

    if (updateError) {
      console.error("Error updating avatar URL:", updateError);
      return;
    }

    setPublicUrl(publicUrl);
    setSessionAvatarUrl(publicUrl);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {editProfileOpen ? (
          ""
        ) : (
          <Button className="bg-transparent text-[#556cd6]">edit</Button>
        )}
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg bg-black/95 border-[#222] text-white [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b border-[#222] px-6 py-4 text-gray-300 text-base">
            Edit profile
          </DialogTitle>
          {/* <DialogDescription className="">
            Make changes to your profile here. You can change your photo and set
            a username.
          </DialogDescription> */}
        </DialogHeader>
        {/* Avatar Upload */}
        <div className="w-full h-full flex justify-center pt-6">
          <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 border-gray-300 shadow-xs shadow-black/10">
            <img
              src={publicUrl || sessionAvatarUrl}
              className="size-full object-cover"
              alt="Profile"
            />
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:ring-ring/50 absolute flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 focus-visible:ring-[3px] outline-none"
              onClick={() => document.getElementById("avatarInput").click()}
              aria-label="Change profile picture"
            >
              <ImagePlusIcon size={16} aria-hidden="true" />
            </button>
            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files[0];
                setFile(f);
                if (f) setPublicUrl(URL.createObjectURL(f));
              }}
            />
          </div>
        </div>
        {/* Form */}
        <div className="px-6 pt-4 pb-6">
          <form className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${id}-fullname`}>Full Name</Label>
              <Input
                id={`${id}-fullname`}
                placeholder="Full Name"
                className=" border-[#222] text-gray-300"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor={`${id}-displayname`}>Display Name</Label>
              <Input
                id={`${id}-displayname`}
                placeholder="Display Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                type="text"
                required
                className=" border-[#222] text-gray-300"
              />
            </div>
          </form>
        </div>
        {/* Footer */}
        <DialogFooter className="border-t border-[#222] px-6 py-4">
          <DialogClose asChild>
            <Button type="button" className="text-black" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" onClick={handleSave}>
              Save changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
