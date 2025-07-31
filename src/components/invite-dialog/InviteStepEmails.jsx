import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function isValidEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

const InviteStepEmails = ({ emails, setEmails, onCopyLink, onNext }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const handleAdd = () => {
    const entered = input
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);
    const invalid = entered.filter((e) => !isValidEmail(e));
    if (invalid.length) {
      setError("Please enter valid email(s).");
      return;
    }
    setEmails([...emails, ...entered]);
    setInput("");
    setError("");
  };

  const handleRemove = (idx) => {
    setEmails(emails.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-1">To:</label>
        <div className="flex flex-wrap gap-2 mb-2">
          {emails.map((email, idx) => (
            <span
              key={idx}
              className="flex items-center px-2 py-1 bg-gray-200 rounded text-xs"
            >
              {email}
              <button
                type="button"
                className="ml-1 text-gray-500 hover:text-red-500"
                onClick={() => handleRemove(idx)}
                aria-label={`Remove ${email}`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter email(s), comma separated"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
            aria-label="Add emails"
          />
          <Button type="button" onClick={handleAdd} size="sm">
            Add
          </Button>
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
      <div className="flex gap-2 justify-between">
        <Button type="button" variant="secondary" onClick={onCopyLink}>
          Copy link
        </Button>
        <Button type="button" onClick={onNext}>
          Next
        </Button>
      </div>
    </div>
  );
};

export default InviteStepEmails;
