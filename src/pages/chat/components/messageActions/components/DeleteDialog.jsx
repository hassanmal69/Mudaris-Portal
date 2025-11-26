import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.jsx";
const DeleteDialog = ({ open, onOpenChange, onConfirmDelete }) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="sm:max-w-lg bg-(--background) text-(--foreground) border border-(--border) rounded-md">
      <DialogHeader>
        <DialogTitle>Delete Message</DialogTitle>
        <DialogDescription>
          Are you sure you want to delete this message? This action cannot be
          undone.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="flex justify-end gap-1">
        <DialogClose asChild>
          <Button className="px-3 py-1.5 rounded-md border border-(--border) hover:bg-(--accent)/30 hover:text-(--foreground) transition-colors">
            Cancel
          </Button>
        </DialogClose>
        <DialogTrigger>
          <Button
            variant={"destructive"}
            onClick={() => {
              onConfirmDelete();
            }}
          >
            Delete
          </Button>
        </DialogTrigger>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);
export { DeleteDialog };

// File: src/pages/chat/components/messageActions/MessageActions.jsx
