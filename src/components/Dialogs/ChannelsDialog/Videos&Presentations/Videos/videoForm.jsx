import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { createVideoDB } from "@/redux/features/video&presentations/videoSlice";
// import { createVideoDB } from "@/redux/features/video&presentations/videosSlice.js";

const VideoForm = ({ onClose, chapterId }) => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    video_link: "",
    presentation_link: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    dispatch(
      createVideoDB({
        ...formData,
        chapter_id: chapterId,
      })
    );

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-1">
        <label className="text-(--muted-foreground) text-[14px]">
          Video Name
        </label>
        <Input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Algebra Basics Part 1"
          required
          className="w-full p-2 border rounded-md border-(--border)"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-(--muted-foreground) text-[14px]">
          Description
        </label>
        <Input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Short description of the video"
          required
          className="w-full p-2 border rounded-md border-(--border)"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-(--muted-foreground) text-[14px]">
          Video Link
        </label>
        <Input
          type="text"
          name="video_link"
          value={formData.video_link}
          onChange={handleChange}
          placeholder="https://..."
          required
          className="w-full p-2 border rounded-md border-(--border)"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-(--muted-foreground) text-[14px]">
          Presentation Link
        </label>
        <Input
          type="text"
          name="presentation_link"
          value={formData.presentation_link}
          onChange={handleChange}
          placeholder="https://..."
          className="w-full p-2 border rounded-md border-(--border)"
        />
      </div>

      <div className="flex justify-between mt-4">
        <Button type="button" onClick={onClose} variant={"destructive"}>
          Cancel
        </Button>
        <Button type="submit" variant={"success"}>
          Add Video
        </Button>
      </div>
    </form>
  );
};

export default VideoForm;
