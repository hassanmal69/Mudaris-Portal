import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VideoForm from "./videoForm.jsx";

const VideoDialog = ({ open, onOpenChange, chapterId, editingData }) => {
  const handleClose = () => onOpenChange(false);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          {
            editingData ?
              <DialogTitle>Update Video</DialogTitle>
              :
              <DialogTitle>Add Video</DialogTitle>
          }
        </DialogHeader>
        <VideoForm onClose={handleClose} data={editingData} chapterId={chapterId} />
      </DialogContent>
    </Dialog>
  );
};

export default VideoDialog;
