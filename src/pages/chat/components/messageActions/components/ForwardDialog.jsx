import React, { useEffect, useState } from "react";
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
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { fetchChannels } from "@/redux/features/channels/channelsSlice";
import { useDispatch } from "react-redux";

export const ForwardDialog = ({ open, onOpenChange, onConfirmForward }) => {
  const { workspace_id } = useParams();
  const [channels, setChannels] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);
  const dispatch = useDispatch();
  const recievingData = async () => {
    const res = await dispatch(fetchChannels(workspace_id));
    setChannels(res?.payload);
  };

  useEffect(() => {
    if (open) recievingData();
  }, [workspace_id, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-(--background) text-(--foreground) border border-(--border) rounded-md">
        <DialogHeader>
          <DialogTitle>Forward Message</DialogTitle>
          <DialogDescription>
            Forward this message in to these groups
            {Array.isArray(channels) &&
              channels.map((m, i) => (
                <div key={i}>
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedChannels((prev) => [...prev, m]); // add
                      } else {
                        setSelectedChannels((prev) =>
                          prev.filter((c) => c.id !== m.id)
                        ); // remove
                      }
                    }}
                  />
                  {m.channel_name}
                </div>
              ))}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-4">
          <DialogClose asChild>
            <Button className="px-3 py-1.5 rounded-md border border-(--border) hover:bg-(--accent)/30 hover:text-(--foreground) transition-colors">
              Cancel
            </Button>
          </DialogClose>
          <DialogTrigger>
            <Button
              onClick={() => {
                onConfirmForward(selectedChannels);
              }}
              className="bg-(--foreground) text-(--muted) px-3 py-1.5 rounded-md hover:bg-(--foreground)/90 transition-colors"
            >
              Forward
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
