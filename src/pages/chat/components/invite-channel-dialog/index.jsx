import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/services/supabaseClient";
import { useDispatch } from "react-redux";
import { addChannelMembers } from "@/redux/features/channelMembers/channelMembersSlice";
import { useParams } from "react-router-dom";
const AddUserInChannel = ({ open, onClose, workspaceId }) => {
  const [emails, setEmails] = useState([]);
  const [input, setInput] = useState("");
  const [errors, setErrors] = useState({});
  const { groupId } = useParams();
  const { workspace_id } = useParams(); // React Router

  const dispatch = useDispatch();
  console.count("AddUserInChannel");
  const handleAdd = () => {
    if (input.trim()) {
      setEmails((prev) => [...prev, input.trim()]);
      setInput("");
    }
  };

  const handleRemove = (idx) => {
    setEmails((prev) => prev.filter((_, i) => i !== idx));
  };
  const handleAddUsers = async () => {
    setErrors({});
    const validUserIds = [];

    for (const email of emails) {
      // 1️⃣ Find user in workspace
      const { data: user, error } = await supabase
        .from("workspace_members")
        .select("user_id, user_profiles!inner(email)")
        .eq("workspace_id", workspace_id)
        .eq("user_profiles.email", email)
        .single();

      if (error || !user) {
        setErrors((prev) => ({ ...prev, [email]: "Not in workspace" }));
        continue;
      }

      // 2️⃣ Check if already in channel
      const { data: existingMember, error: existingError } = await supabase
        .from("channel_members")
        .select("id")
        .eq("channel_id", groupId)
        .eq("user_id", user.user_id)
        .maybeSingle(); // ✅ won't throw if no row found

      if (existingMember) {
        setErrors((prev) => ({ ...prev, [email]: "Already in channel" }));
        continue;
      }

      validUserIds.push(user.user_id);
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
      <DialogContent className="bg-black/90 border-[#111] border text-gray-300">
        <DialogHeader>
          <DialogTitle>Add Users to Channel</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 ">
          {emails.map((email, idx) => (
            <div key={idx} className="flex items-center gap-2">
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
            className="w-full border border-[#111] rounded-md p-2 resize-none"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" className="text-black" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddUsers}>Add Users</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserInChannel;
