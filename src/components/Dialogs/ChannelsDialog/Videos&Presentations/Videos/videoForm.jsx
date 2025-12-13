import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { createVideoDB, updateVideoDB } from "@/redux/features/video&presentations/videoSlice";
import { Label } from "@/components/ui/label";
import { addToast } from "@/redux/features/toast/toastSlice";

const VideoForm = ({ onClose, chapterId, data }) => {
  const dispatch = useDispatch();
  if (data) var { name, description, video_link, presentation_link, id } = data

  const [formData, setFormData] = useState({
    name: name,
    description: description,
    video_id: video_link,
    presentation_file: presentation_link,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      video_id: "",
      presentation_file: null,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    if (data) {
      dispatch(
        updateVideoDB({
          id,
          name: formData.name,
          description: formData.description,
          video_link: formData.video_id,
          chapter_id: chapterId,
          presentation_file: formData.presentation_file
        })
      )
      dispatch(
        addToast({
          message: "updated video successfully.",
          type: "success",
          duration: 3000,
        })
      );
    } else {
      dispatch(
        createVideoDB({
          name: formData.name,
          description: formData.description,
          video_link: formData.video_id,
          chapter_id: chapterId,
          presentation_file: formData.presentation_file
        })
      )
      dispatch(
        addToast({
          message: "added a video successfully.",
          type: "success",
          duration: 3000,
        })
      );
    }
    resetForm()
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
        <label
          htmlFor="video_id"
          className="text-(--muted-foreground) text-[14px]"
        >
          Video id
        </label>
        <Input
          type="text"
          name="video_id"
          value={formData.video_id}
          onChange={handleChange}
          placeholder="1137954405"
          required
          className="w-full p-2 border rounded-md border-(--border)"
        />
      </div>
      {
        data ?
          <p></p> :
          <div className="flex flex-col gap-1">
            <Label className="text-(--muted-foreground) text-[14px]">
              Add presentation
            </Label>
            <Input
              name="presentation_ppt"
              type="file"
              accept=".ppt,.pptx"
              // value={formData.presentation_file}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  presentation_file: e.target.files[0],
                }))
              }
              //onChange={handleChange}
              placeholder="https://..."
              className="w-full p-2 border rounded-md border-(--border)"
            />
          </div>

      }

      <div className="flex justify-between mt-4">
        <Button type="button" onClick={onClose} variant={"destructive"}>
          Cancel
        </Button>
        {
          data ? <Button type="submit" variant={"success"}>
            Update Video
          </Button> :
            <Button type="submit" variant={"success"}>
              Add Video
            </Button>
        }
      </div>
    </form>
  );
};

export default VideoForm;
//1137954405
