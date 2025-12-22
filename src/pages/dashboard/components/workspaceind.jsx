import React, { Suspense } from "react";
const Chat = React.lazy(() => import("../../chat/index.jsx"));

const WorkSpaceInd = () => {
  return (
    <div className="flex w-full bg-(--background) h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <Chat />
      </Suspense>
    </div>
  );
};

export default WorkSpaceInd;
