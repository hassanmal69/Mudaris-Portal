import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import VideoForm from "./videoForm.jsx";

const VideoDialog = ({ open, onOpenChange, chapterId }) => {
  const handleClose = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Video</DialogTitle>
        </DialogHeader>
        <VideoForm onClose={handleClose} chapterId={chapterId} />
      </DialogContent>
    </Dialog>
  );
};

export default VideoDialog;
