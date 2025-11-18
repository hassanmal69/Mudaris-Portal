import React from "react";
import { Input } from "@/components/ui/input.jsx";
import { Label } from "@/components/ui/label.jsx";
const WorkspaceInfo = ({ state, setState, errors, handleNext }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="workspace-name" className="text-[#4d3763]">
          Workspace name
          <span className="text-red-500">*</span>
        </Label>
        <Input
          id="workspace-name"
          value={state.name || ""}
          onChange={(e) => setState({ ...state, name: e.target.value })}
          placeholder="Enter workspace name"
          required
          aria-invalid={!!errors?.name}
          className="text-[#c7c7c7]"
        />
        {errors?.name && (
          <p className="text-xs text-red-500 mt-1">{errors?.name}</p>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="workspace-description" className="text-[#4d3763]">
          Description
        </Label>
        <Input
          id="workspace-description"
          value={state.description || ""}
          onChange={(e) => setState({ ...state, description: e.target.value })}
          placeholder="Optional"
          className="text-[#c7c7c7]"
        />
      </div>
    </div>
  );
};

export default WorkspaceInfo;
