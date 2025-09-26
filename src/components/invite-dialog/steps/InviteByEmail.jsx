import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useSelector, useDispatch } from "react-redux";
import {
  selectWorkspaceMembers,
  fetchWorkspaceMembers,
} from "@/features/workspaceMembers/WorkspaceMembersSlice";
import { useParams } from "react-router-dom";
import { Link } from "lucide-react";

function isValidEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

const InviteByEmail = ({ emails, setEmails, onCopyLink, onNext }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const { workspace_id } = useParams();
  const currentUserEmail = useSelector((state) => state.auth.user?.email);
  const workspaceMembers = useSelector(selectWorkspaceMembers(workspace_id));
  const dispatch = useDispatch();

  useEffect(() => {
    if (workspace_id) {
      dispatch(fetchWorkspaceMembers(workspace_id));
    }
  }, [dispatch, workspace_id]);
  const handleAdd = () => {
    const entered = input
      .split(",")
      .map((e) => e.trim())
      .filter(Boolean);

    if (!entered.length) return;

    const invalid = entered.filter((e) => !isValidEmail(e));
    if (invalid.length) {
      setError("Please enter valid email(s).");
      return;
    }

    const duplicates = entered.filter((e) => emails.includes(e));
    if (duplicates.length) {
      setError(`These email(s) already exist: ${duplicates.join(", ")}`);
      return;
    }

    if (entered.includes(currentUserEmail?.toLowerCase())) {
      setError("You cannot invite yourself.");
      return;
    }

    const alreadyMember = workspaceMembers.some((m) =>
      entered.some(
        (e) => m.user_profiles?.email?.toLowerCase() === e.toLowerCase()
      )
    );

    if (alreadyMember) {
      setError("One or more of these users are already members.");
      return;
    }

    // ✅ Success: add them to list
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
        <label className="block text-sm font-medium mb-1">
          write email to copy link
        </label>
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
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter email(s), comma separated"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === "," || e.key === " ") {
                e.preventDefault();
                handleAdd();
              }
            }}
            aria-label="Add emails"
            rows={4}
            className="w-full border border-gray-300 rounded-md p-2 resize-none"
          />
        </div>
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
      <div className="flex gap-2 justify-between">
        <Button
          type="button"
          className="border-0 outline-0 bg-transparent text-[#333] "
          onClick={onCopyLink}
          disabled={!input.trim() && emails.length === 0}
        >
          Copy link
          <Link className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          onClick={onNext}
          disabled={!input.trim() && emails.length === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default InviteByEmail;