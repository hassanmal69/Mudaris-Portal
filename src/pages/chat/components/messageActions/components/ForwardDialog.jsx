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
import { useDispatch, useSelector } from "react-redux";

export const ForwardDialog = ({ open, onOpenChange, onConfirmForward }) => {
  const { workspace_id } = useParams();
  const [selectedChannels, setSelectedChannels] = useState([]);
  const dispatch = useDispatch();
  const channelState = useSelector((state) => state.channels);

  useEffect(() => {
      dispatch(fetchChannels(workspace_id));
  }, []);
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-(--background) text-(--foreground) border border-(--border) rounded-md">
        <DialogHeader>
          <DialogTitle>Forward Message</DialogTitle>
          <DialogDescription>
            Forward this message in to these groups
            {channelState.allIds.map((id) => {
              const ch = channelState.byId[id];
              const isChecked = selectedChannels.some((c) => c.id === ch.id);
              return (
                <div key={ch.id}>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedChannels((prev) => [...prev, ch]);
                      } else {
                        setSelectedChannels((prev) =>
                          prev.filter((c) => c.id !== ch.id)
                        );
                      }
                    }}
                  />
                  {ch.channel_name}
                </div>
              );
            })}

          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex justify-end gap-4">
          <DialogClose asChild>
            <Button variant={"destructive"}>Cancel</Button>
          </DialogClose>
          <DialogTrigger>
            <Button
              onClick={() => {
                onConfirmForward(selectedChannels);
              }}
              variant={"success"}
            >
              Forward
            </Button>
          </DialogTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
