import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ChapterForm from "./chapterForm.jsx";

const ChapterDialog = ({ open, onOpenChange }) => {
  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Chapter</DialogTitle>
        </DialogHeader>
        <ChapterForm onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default ChapterDialog;
