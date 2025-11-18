import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AnnouncementForm from "./AnnouncementForm";

const AnnouncementDialog = ({ open, onOpenChange }) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Announcement</DialogTitle>
        </DialogHeader>
        <AnnouncementForm onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementDialog;
