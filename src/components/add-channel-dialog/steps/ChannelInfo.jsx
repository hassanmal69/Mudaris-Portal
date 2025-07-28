import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ChannelInfo = ({ state, setState, errors, usedIn }) => {
  let isWhite;
  if (usedIn === "CreateWorkspace") {
    isWhite = true
  }
  return (
    <div className={`space-y-4 ${isWhite ? 'text-white' : ""}`}>
      <div>
        <Label htmlFor="channel-name">
          Channel Name<span className="text-red-500">*</span>
        </Label>
        <Input
          id="channel-name"
          value={state.name || ""}
          onChange={(e) => setState({ ...state, name: e.target.value })}
          placeholder="Enter channel name"
          required
          aria-invalid={!!errors.name}
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name}</p>
        )}
      </div>
      <div>
        <Label htmlFor="channel-description">Description</Label>
        <Input
          id="channel-description"
          value={state.description || ""}
          onChange={(e) => setState({ ...state, description: e.target.value })}
          placeholder="Optional"
        />
      </div>
    </div>
  )
};

export default ChannelInfo;
