import React from "react";
import AddChannelDialog from "@/components/add-channel-dialog";

const CreateWorkspace = () => {
  return (
    <div className="fixed pointer-events-auto inset-0 z-130 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#fff] text-gray-900">
        <AddChannelDialog open={true} usedIn={"createWorkspace"} />
      </div>
    </div>
  );
};

export default CreateWorkspace;
