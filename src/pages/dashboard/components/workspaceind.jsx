import React, { Suspense } from "react";
import { useSelector } from "react-redux";
import EditProfile from "@/pages/profile/components/editProfile.jsx";
const Chat = React.lazy(() => import("../../chat/index.jsx"));

const WorkSpaceInd = () => {
  const editProfileOpen = useSelector((state) => state.profile.editProfileOpen);
  return (
    <div className="flex w-full h-[90vh]">
      <div
        className={`absolute h-full w-full flex pointer-events-none justify-center z-[9999] items-center ${
          editProfileOpen ? "block" : "hidden"
        }`}
      >
        <EditProfile />
      </div>
      <Chat />
    </div>
  );
};

export default WorkSpaceInd;
