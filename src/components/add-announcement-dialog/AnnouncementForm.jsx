import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { createAnnouncement } from "@/features/announcements/announcementsSlice";
import { Input } from "../ui/input";
import { Select } from "radix-ui";
import { Textarea } from "../ui/textarea";

const AnnouncementForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("info");

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createAnnouncement({ title, description, priority }));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 ">
      <div className="flex flex-col gap-0.5">
        <label className=" text-(--muted-foreground) text-[14px]">Title</label>
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Live Q&A Session This Friday"
          className="w-full p-2 border rounded-md border-(--border) ouline-0"
        />
      </div>
      <div className="flex flex-col gap-0.5">
        <label className=" text-(--muted-foreground) text-[14px]">
          Priority Tag
        </label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full p-2 border rounded-md  border-(--border) outline-0"
        >
          <option value="important">Important</option>
          <option value="update">Update</option>
          <option value="event">Event</option>
          <option value="info">Info</option>
        </select>
      </div>
      <div className="flex flex-col gap-0.5">
        <label className=" text-(--muted-foreground) text-[14px]">
          Description
        </label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          placeholder="Join us for a live Q&A session this Friday at 3 PM."
          className="w-full p-2 border rounded-md  border-(--border) ouline-none"
        />
      </div>
      <div className="flex justify-between mt-4">
        <Button type="button" onClick={onClose} className="bg-red-700">
          Cancel
        </Button>
        <Button type="submit" className="bg-green-500">
          Add Announcement
        </Button>
      </div>
    </form>
  );
};

export default AnnouncementForm;
