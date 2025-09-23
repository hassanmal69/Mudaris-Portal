import React, { useState } from "react";
import { Button } from "@/components/ui/button";
const parseUsers = (input) => {
  return input
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
};
const InviteWorkspaceUsers = ({ state, setState, errors, onSkip }) => {
  const [input, setInput] = useState("");

  const handleAdd = () => {
    const users = parseUsers(input);
    setState({ ...state, users: [...(state.users || []), ...users] });
    setInput("");
  };
  return (
    <div className="space-y-4">
      <div className="text-[#c7c7c7] flex flex-col gap-2">
        <h6>Enter email's</h6>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add students with email (comma separated)"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "," || e.key === " ") {
              e.preventDefault();
              handleAdd();
            }
          }}
          aria-label="Add emails"
          rows={4}
          className="w-full border border-gray-300 text-[#c7c7c7] rounded-md p-2 resize-none"
        />
      </div>

      {errors.users && (
        <p className="text-xs text-red-500 mt-1">{errors.users}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {(state.users || []).map((user, idx) => (
          <span key={idx} className="px-2 py-1 bg-[#444] rounded text-xs">
            {user}
          </span>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onSkip}
          aria-label="Skip invite"
          className="text-[#556cd6] border
          bg-transparent
          transition delay-200 duration-300 ease-in-out
          border-[#556cd6] hover:bg-[#556cd6] hover:text-white"
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
};

export default InviteWorkspaceUsers;
