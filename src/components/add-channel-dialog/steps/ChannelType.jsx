import React from "react";
import { Button } from "@/components/ui/button";
import { Globe, Lock } from "lucide-react";
const ChannelType = ({ state, setState }) => (
  <div className="flex flex-col gap-4">
    <div className="flex gap-2">
      <Button
        type="button"
        variant={state.type === "public" ? "default" : "outline"}
        className="flex-1 bg-gray-200 hover:bg-gray-300 text-black border border-gray-400"
        onClick={() => setState({ ...state, type: "public" })}
        aria-pressed={state.type === "public"}
      >
        <Globe className="w-4 h-4 mr-2" />
        Public
      </Button>
      <Button
        type="button"
        variant={state.type === "private" ? "default" : "outline"}
        className="flex-1 bg-gray-500 hover:bg-gray-600 text-white"
        onClick={() => setState({ ...state, type: "private" })}
        aria-pressed={state.type === "private"}
      >
        <Lock className="w-4 h-4 mr-2" />
        Private
      </Button>
    </div>
    <p className="text-xs text-gray-500">
      Public channels are visible to everyone. Private channels are invite-only.
    </p>
  </div>
);

export default ChannelType;
