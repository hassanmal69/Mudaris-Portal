import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import LectureLinksFrom from "./LectureLinksFrom";
const LectureDialog = ({ open, onOpenChange, lecturesLink }) => {
  const handleClose = () => {
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add lecture links</DialogTitle>{" "}
          <DialogDescription>
            Fill in the form below to add a new lecture link.
          </DialogDescription>
        </DialogHeader>
        <LectureLinksFrom onClose={handleClose} lecturesLink={lecturesLink} />
      </DialogContent>
    </Dialog>
  );
};

export default LectureDialog;
