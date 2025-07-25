import React from "react";
import { Button } from "@/components/ui/button";

const ChannelType = ({ state, setState }) => (
  <div className="flex flex-col gap-4">
    <div className="flex gap-2">
      <Button
        type="button"
        variant={state.type === "public" ? "default" : "outline"}
        className="flex-1"
        onClick={() => setState({ ...state, type: "public" })}
        aria-pressed={state.type === "public"}
      >
        Public
      </Button>
      <Button
        type="button"
        variant={state.type === "private" ? "default" : "outline"}
        className="flex-1"
        onClick={() => setState({ ...state, type: "private" })}
        aria-pressed={state.type === "private"}
      >
        Private
      </Button>
    </div>
    <p className="text-xs text-gray-500">
      Public channels are visible to everyone. Private channels are invite-only.
    </p>
  </div>
);

export default ChannelType;
