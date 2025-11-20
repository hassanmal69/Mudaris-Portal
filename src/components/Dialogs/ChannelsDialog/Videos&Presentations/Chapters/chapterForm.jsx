import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import { createChapterDB } from "@/redux/features/video&presentations/chapterSlice.js";
import { useParams } from "react-router-dom";

const ChapterForm = ({ onClose }) => {
  const dispatch = useDispatch();
const {workspace_id}=useParams()
  const [chapterName, setChapterName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!chapterName.trim()) return;
    dispatch(
      createChapterDB({
        name: chapterName,
        workspace_Id:workspace_id
      })
    );

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col gap-1">
        <label className="text-(--muted-foreground) text-[14px]">
          Chapter Name
        </label>

        <Input
          type="text"
          placeholder="e.g. Introduction to Algebra"
          value={chapterName}
          onChange={(e) => setChapterName(e.target.value)}
          required
          className="w-full p-2 border rounded-md border-(--border)"
        />
      </div>

      <div className="flex justify-between mt-4">
        <Button type="button" onClick={onClose} className="bg-(--destructive)">
          Cancel
        </Button>
        <Button type="submit" className="bg-green-800">
          Add Chapter
        </Button>
      </div>
    </form>
  );
};

export default ChapterForm;
