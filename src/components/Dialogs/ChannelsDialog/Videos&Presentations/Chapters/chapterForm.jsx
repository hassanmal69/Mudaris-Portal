import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch } from "react-redux";
import {
  createChapterDB,
  updateChapterDB,
} from "@/redux/features/video&presentations/chapterSlice.js";
import { useParams } from "react-router-dom";
const ChapterForm = ({ onClose, data }) => {
  const dispatch = useDispatch();
  const { workspace_id } = useParams();
  const [chapterName, setChapterName] = useState(data?.name || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chapterName.trim()) return;

    if (data) {
      // EDIT MODE
      dispatch(
        updateChapterDB({
          id: data.id,
          payload: { name: chapterName },
        })
      );
    } else {
      // ADD MODE
      dispatch(
        createChapterDB({
          name: chapterName,
          workspace_Id: workspace_id,
        })
      );
    }

    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="text-(--muted-foreground) text-[14px]">
        Chapter Name
      </label>
      <Input
        value={chapterName}
        onChange={(e) => setChapterName(e.target.value)}
        required
      />

      <div className="flex justify-between mt-4">
        <Button type="button" onClick={onClose} variant={"destructive"}>
          Cancel
        </Button>

        <Button type="submit" variant={"success"}>
          {data ? "Update Chapter" : "Add Chapter"}
        </Button>
      </div>
    </form>
  );
};
export default ChapterForm;
