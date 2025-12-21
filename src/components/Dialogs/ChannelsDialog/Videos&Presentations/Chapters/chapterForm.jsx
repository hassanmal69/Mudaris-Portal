import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import {
  createChapterDB,
  updateChapterDB,
} from "@/redux/features/video&presentations/chapterSlice.js";
import { useParams } from "react-router-dom";
import HandleSupabaseLogicNotification from "@/layout/topbar/notification/handleSupabaseLogicNotification";
const ChapterForm = ({ onClose, data }) => {
  const dispatch = useDispatch();
  const { workspace_id } = useParams();
  const [chapterName, setChapterName] = useState(data?.name || "");
  const { currentWorkspace } = useSelector(
    (state) => state.workSpaces
  )
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
      HandleSupabaseLogicNotification(
        'chapterDb',
        workspace_id,
        null,
        null,
        `New Chapter is added in Video's & Presentation in ${currentWorkspace?.workspace_name}`,
      )
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
