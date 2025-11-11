import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AnnouncementForm from "./AnnouncementForm";

const AddAnnouncementDialog = ({ open, onOpenChange }) => {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className=" bg-(--background) max-w-md text-(--foreground) border border-(--border) w-full">
        <DialogHeader>
          <DialogTitle>Add Announcement</DialogTitle>
        </DialogHeader>
        <AnnouncementForm onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default AddAnnouncementDialog;
