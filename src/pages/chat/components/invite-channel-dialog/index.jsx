import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import {
  addChannelMembers,
  selectChannelMembers,
} from "@/redux/features/channelMembers/channelMembersSlice";
import { useParams } from "react-router-dom";
import {
  fetchWorkspaceMembers,
  selectWorkspaceMembers,
} from "@/redux/features/workspaceMembers/WorkspaceMembersSlice";
const AddUserInChannel = ({ open, onClose }) => {
  const [emails, setEmails] = useState([]);
  const [input, setInput] = useState("");
  const [errors, setErrors] = useState({});
  const { groupId, workspace_id } = useParams();
  const wsMembers = useSelector(selectWorkspaceMembers(workspace_id));
  const chMembers = useSelector(selectChannelMembers(groupId));
  const dispatch = useDispatch();
  console.count("AddUserInChannel");
  const handleAdd = useCallback(() => {
    if (input.trim()) {
      setEmails((prev) => [...prev, input.trim()]);
      setInput("");
    }
  }, [input]);

  useEffect(() => {
    if (wsMembers.length < 1) {
      dispatch(fetchWorkspaceMembers(workspace_id));
    }
  }, [workspace_id]);

  const handleRemove = (idx) => {
    setEmails((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleAddUsers = async () => {
    setErrors({});
    const validUserIds = [];

    for (const email of emails) {
      // 1️⃣ Find user in workspace
      const wsUser = wsMembers.find((m) => m.user_profiles?.email === email);
      if (!wsUser) {
        setErrors((prev) => ({ ...prev, [email]: "Not in workspace" }));
        continue;
      }

      const alreadyInChannel = chMembers.some(
        (m) => m.user_id === wsUser.user_id
      );
      if (alreadyInChannel) {
        setErrors((prev) => ({ ...prev, [email]: "Already in channel" }));
        continue;
      }
      validUserIds.push(wsUser.user_id);
    }

    // 3️⃣ Only insert valid + non-duplicate users
    if (validUserIds.length > 0) {
      dispatch(
        addChannelMembers({ channelId: groupId, userIds: validUserIds })
      );
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-(--primary) border-(--border) border text-(--primary-foreground)">
        <DialogHeader>
          <DialogTitle>Add Users to Channel</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 ">
          {emails.map((email, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-(--card)">
              <span>{email}</span>
              <button onClick={() => handleRemove(idx)}>×</button>
              {errors[email] && (
                <span className="text-red-500">{errors[email]}</span>
              )}
            </div>
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
            className="w-full border border-(--border) rounded-md p-2 resize-none"
          />
        </div>
        <DialogFooter>
          <Button variant={"destructive"} onClick={onClose}>
            Cancel
          </Button>
          <Button variant={"success"} onClick={handleAddUsers}>
            Add Users
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default React.memo(AddUserInChannel);
