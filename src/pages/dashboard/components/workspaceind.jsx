import React, { Suspense } from "react";
import EditProfile from "@/pages/profile/components/editProfile.jsx";
const Chat = React.lazy(() => import("../../chat/index.jsx"));

const WorkSpaceInd = () => {
  return (
    <div className="flex w-[100%] h-full">
      <div
      >
        <EditProfile />
      </div>
      <Chat />
    </div>
  );
};

export default WorkSpaceInd;
