import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const parseUsers = (input) => {
  return input
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
};

const InviteUsers = ({ state, setState, errors, onSkip, onCopyLink, usedIn }) => {
  const [input, setInput] = useState("");
  let isWhite;
  if (usedIn === "CreateWorkspace") {
    isWhite = true
  }
  const handleAdd = () => {
    const users = parseUsers(input);
    setState({ ...state, users: [...(state.users || []), ...users] });
    setInput("");
  };

  return (
    <div className={`space-y-4 `}>
     <div className={`${isWhite ? 'text-white' : ""}`}>
     <h6>Enter email's</h6>
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Add students with username or email (comma separated)"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleAdd();
        }}
      />
      </div>
      <Button type="button" size="sm" className="mt-2" onClick={handleAdd}>
        Add
      </Button>
      {errors.users && (
        <p className="text-xs text-red-500 mt-1">{errors.users}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {(state.users || []).map((user, idx) => (
          <span key={idx} className="px-2 py-1 bg-gray-200 rounded text-xs">
            {user}
          </span>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <Button type="button" variant="outline" onClick={onSkip}>
          Skip for now
        </Button>
        <Button type="button" variant="secondary" onClick={onCopyLink}>
          Copy Invite Link
        </Button>
      </div>
    </div>
  );
};

export default InviteUsers;
