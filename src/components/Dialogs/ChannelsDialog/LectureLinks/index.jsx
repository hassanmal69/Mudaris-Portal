import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import LectureLinksFrom from "./LectureLinksFrom";
const LectureDialog = ({ open, onOpenChange }) => {
  const handleClose = () => {
    onOpenChange(false);
  };
  console.log("imma", open);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add lecture links</DialogTitle>{" "}
          <DialogDescription>
            Fill in the form below to add a new lecture link.
          </DialogDescription>
        </DialogHeader>
        <LectureLinksFrom onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
};

export default LectureDialog;
