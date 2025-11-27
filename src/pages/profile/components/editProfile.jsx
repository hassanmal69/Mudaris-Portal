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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.jsx";
const EditProfile = () => {
  const { session } = useSelector((state) => state.auth);
  const [file, setFile] = useState(null);
  const [name, setName] = useState(session.user?.user_metadata?.fullName);
  const [publicUrl, setPublicUrl] = useState(undefined);
  const [sessionAvatarUrl, setSessionAvatarUrl] = useState(
    session.user.user_metadata.avatar_url
  );
  const id = useId();
  useEffect(() => {
    setSessionAvatarUrl(session.user.user_metadata.avatar_url);
  }, [session]);

  const handleSave = async () => {
    // Update names
    const { error } = await supabase.auth.updateUser({
      data: { fullName: name }
    });
    if (error) {
      console.error("Error updating user info", error);
      return;
    }
    const { error: updateErrorinProfile } = await supabase.from('profiles')
      .update({
        full_name: name
      }).eq('id', session.user.id)
    if (updateErrorinProfile) throw updateErrorinProfile
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
    const { error: updateErrorinProfile } = await supabase.from('profiles')
      .update({
        avatar_url: publicUrl
      }).eq('id', session.user.id)
    if (updateErrorinProfile) throw updateErrorinProfile
    setPublicUrl(publicUrl);
    setSessionAvatarUrl(publicUrl);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="text-(--primary-foregroun)">
          edit
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-0 overflow-y-visible p-0 sm:max-w-lg  [&>button:last-child]:top-3.5">
        <DialogHeader className="contents space-y-0 text-left">
          <DialogTitle className="border-b border-(--border) px-6 py-4 text-(--muted-foreground) text-base">
            Edit profile
          </DialogTitle>
          {/* <DialogDescription className="">
            Make changes to your profile here. You can change your photo and set
            a username.
          </DialogDescription> */}
        </DialogHeader>
        {/* Avatar Upload */}
        <div className="w-full h-full flex justify-center pt-6">
          <div className="relative flex size-20 items-center justify-center overflow-hidden rounded-full border-4 border-(--chart-5) shadow-xs shadow-black/10">
            <img
              src={publicUrl || sessionAvatarUrl}
              className="size-full object-cover"
              alt="Profile"
            />
            <button
              type="button"
              className="focus-visible:border-ring focus-visible:(--ring)-ring/50 absolute flex size-8 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white hover:bg-(--popover) focus-visible:ring-[3px] outline-none"
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
                className=" border-(--border) dark:bg-(--input-background) bg-(--switch-background) text-(--accent-foreground)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                required
              />
            </div>
          </form>
        </div>
        {/* Footer */}
        <DialogFooter className="border-t border-[#222] px-6 py-4">
          <DialogClose asChild>
            <Button type="button" variant="destructive">
              Cancel
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="button" variant={"success"} onClick={handleSave}>
              Save changes
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfile;
