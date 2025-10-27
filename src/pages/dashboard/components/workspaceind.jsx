import React, { Suspense } from "react";
import EditProfile from "@/pages/profile/components/editProfile.jsx";
const Chat = React.lazy(() => import("../../chat/index.jsx"));

const WorkSpaceInd = () => {
  return (
    <div className="flex w-[100%] bg-(--background) h-full">
      <Chat />
    </div>
  );
};

export default WorkSpaceInd;
