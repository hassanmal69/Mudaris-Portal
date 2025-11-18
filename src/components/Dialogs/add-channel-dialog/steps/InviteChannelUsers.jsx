import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  selectWorkspaceMembers,
  selectLoading,
  selectError,
} from "@/redux/features/workspaceMembers/WorkspaceMembersSlice";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { Link } from "lucide-react";
const parseUsers = (input) => {
  return input
    .split(",")
    .map((u) => u.trim())
    .filter(Boolean);
};

const InviteChannelUsers = ({
  state,
  setState,
  errors,
  onSkip,
  onCopyLink,
}) => {
  const { workspace_id } = useParams();
  const members = useSelector(selectWorkspaceMembers(workspace_id));
  const loading = useSelector(selectLoading(workspace_id));
  const error = useSelector(selectError(workspace_id));
  const [input, setInput] = useState("");
  const [lookupError, setLookupError] = useState("");
  const [emails, setEmails] = useState([]);
  if (loading) return <p>Loading workspace members...</p>;
  if (error) return <p>Error: {error}</p>;

  const handleAdd = async () => {
    const parsedEmails = parseUsers(input);
    setInput("");
    setLookupError("");
    if (parsedEmails.length === 0) return;
    setEmails((prev) => [...prev, ...parsedEmails]); // ✅ update state

    const validUsers = members.filter((m) =>
      parsedEmails.includes(m.user_profiles?.email)
    );

    const foundUsers = validUsers.map((wm) => ({
      id: wm.user_id,
      email: wm.user_profiles.email,
      name: wm.user_profiles.full_name,
    }));
    const foundEmails = foundUsers.map((u) => u.email);
    const notFound = parsedEmails.filter((e) => !foundEmails.includes(e));
    if (notFound.length > 0) {
      setLookupError(
        `These users are not in this workspace: ${notFound.join(",")}`
      );
    }
    // updating state with only valid users

    setState({
      ...state,
      users: [...(state.users || []), ...foundUsers],
    });
    if (error) {
      console.log(error);
      setLookupError("Error checking users. Please try again!");
    }
  };
  const handleRemove = (idx) => {
    setEmails((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div className={`space-y-4 `}>
      <div className="flex flex-col gap-2">
        <h6>Enter email's</h6>
        {emails.map((email, idx) => (
          <span
            key={idx}
            className="flex items-center px-2 py-1 bg-[#333] w-fit rounded text-xs"
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
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add students with email (comma separated)"
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "," || e.key === " ") {
              e.preventDefault(); // prevent newline on Enter
              handleAdd();
            }
          }}
          aria-label="Add emails"
          rows={4}
          className="w-full border border-gray-300 rounded-md p-2 resize-none"
        />
      </div>
      {lookupError && <p className="text-xs text-red-500">{lookupError}</p>}

      {errors?.users && (
        <p className="text-xs text-red-500 mt-1">{errors?.users}</p>
      )}
      <div className="flex flex-wrap gap-2">
        {(state.users || []).map((user, idx) => (
          <span key={idx} className="px-2 py-1 text-black rounded text-xs">
            {user.name || user.email}
          </span>
        ))}
      </div>
      <div className="flex gap-2 mt-4">
        <Button
          type="button"
          className="bg-transparent cursor-pointer"
          onClick={onCopyLink}
        >
          <span>
            <Link />
          </span>
          Copy Invite Link
        </Button>
        <Button
          type="button"
          onClick={onSkip}
          aria-label="Skip invite"
          className="text-[#556cd6] border
          transition delay-200 duration-300 ease-in-out
          border-[#556cd6] hover:bg-[#556cd6] hover:text-white"
        >
          Skip for now
        </Button>
      </div>
    </div>
  );
};

export default InviteChannelUsers;
