import React, { useEffect, useState, Suspense } from "react";

const Chat = React.lazy(() => import("../../chat/index.jsx"));

const WorkSpaceInd = () => {
  return (
    <div className="flex h-[100vh] w-full relative text-black">
      <Suspense fallback={<div>Loading Chat...</div>}>
        <Chat />
      </Suspense>
    </div>
  );
};

export default WorkSpaceInd;
