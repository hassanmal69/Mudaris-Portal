import React, { useState } from "react";
import AddWorkspaceDialog from "@/components/Dialogs/add-workspace-dialog/index.jsx";
const CreateWorkspace = () => {
  const [open, setOpen] = useState(true);

  if (!open) return null;
  return (
    <div className="fixed pointer-events-auto inset-0 z-200 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 rounded-2xl ">
        <AddWorkspaceDialog open={open} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
};

export default CreateWorkspace;
