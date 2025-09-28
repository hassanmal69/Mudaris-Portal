import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ChannelInfo = ({ state, setState, errors }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="channel-name" className="text-[#4d3763]">
          Channel Name
          <span className="text-red-500">*</span>
        </Label>
        <Input
          id="channel-name"
          value={state.name || ""}
          onChange={(e) => setState({ ...state, name: e.target.value })}
          placeholder="Enter channel name"
          required
          aria-invalid={!!errors.name}
          className="outline-0 border-[#222]"
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name}</p>
        )}
      </div>
      <div className="flex flex-col gap-2" aria-describedby={undefined}>
        <Label htmlFor="channel-description" className="text-[#4d3763]">
          Description
        </Label>
        <Input
          id="channel-description"
          value={state.description || ""}
          onChange={(e) => setState({ ...state, description: e.target.value })}
          placeholder="Optional"
          className="outline-0 border-[#222]"
        />
      </div>
    </div>
  );
};

export default ChannelInfo;
