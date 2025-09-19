import React, { useState } from "react";
import AddWorkspaceDialog from "@/components/add-workspace-dialog";

const CreateWorkspace = () => {
  const [open, setOpen] = useState(true);

  return (
    <div className="fixed pointer-events-auto inset-0 z-130 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#fff] text-gray-900">
        <AddWorkspaceDialog open={open} onClose={() => setOpen(false)} />
      </div>
    </div>
  );
};

export default CreateWorkspace;
