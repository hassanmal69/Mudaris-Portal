import React from "react";
import "./vimeo.css";
const PrivateVimeoPlayer = ({ embedHtml }) => {
  return (
    <div
      className="video-container w-full h-full"
      dangerouslySetInnerHTML={{ __html: embedHtml }}
    />
  );
};

export default PrivateVimeoPlayer;
