import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const AddUserInChannel = ({ open, onClose, channelId }) => {
  const [state, setState] = useState({ users: [] });
  const [errors, setErrors] = useState(null);

  const handleAddUsers = async () => {
    try {
      // 🔹 Make an API call or dispatch Redux action to add users to channel
      console.log("Adding users to channel:", channelId, state.users);

      // Example: dispatch(addUsersToChannel(channelId, state.users));
      onClose();
    } catch (err) {
      console.error(err);
      setErrors({ users: "Failed to add users. Please try again." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Users to Channel</DialogTitle>
        </DialogHeader>
        <div className={`space-y-4 `}>
          <div className="text-black flex flex-col gap-2">
            <h6>Enter email's</h6>
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
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleAddUsers}>Add Users</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddUserInChannel;
