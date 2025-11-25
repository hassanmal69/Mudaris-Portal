import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ChapterForm from "./chapterForm.jsx";

const ChapterDialog = ({ open, onOpenChange, editingData }) => {
  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          {
            editingData ? 
              <DialogTitle>Update Chapter</DialogTitle>
             : <DialogTitle>Add Chapter</DialogTitle>
          }
        </DialogHeader>
        <ChapterForm data={editingData} onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default ChapterDialog;
