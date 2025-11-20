import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AnnouncementForm from "./AnnouncementForm";

const AnnouncementDialog = ({ open, onOpenChange, announcement }) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Announcement</DialogTitle>
        </DialogHeader>
        <AnnouncementForm onClose={handleClose} announcement={announcement} />
      </DialogContent>
    </Dialog>
  );
};

export default AnnouncementDialog;
