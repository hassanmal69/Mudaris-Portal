import React from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

const CreateChannelButton = React.memo(({ setAddChannelOpen }) => {
  console.log("CreateChannelButton rendered");
  
  return (
    <button
      className="flex items-center gap-2 w-full px-2 py-2 rounded hover:bg-(--sidebar-accent)"
      onClick={() => setAddChannelOpen(true)}
    >
      <PlusIcon className="w-4 h-4" />
      <p className="text-[15px]">Create Channel</p>
    </button>
  );
});

CreateChannelButton.displayName = "CreateChannelButton";

export default CreateChannelButton;