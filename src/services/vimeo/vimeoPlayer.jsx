import React, { useEffect, useRef, useState } from "react";
import { fetchPrivateVideos } from "./vimeo.js";
import PrivateVimeoPlayer from "./privateVimeoPlayer.jsx";

const VimeoPlayer = ({ videoId }) => {
  const [videoData, setVideoData] = useState(null);
  const [invalid, setInvalid] = useState(false);

  const isNumeric = (value) => !isNaN(value);

  useEffect(() => {
    if (!isNumeric(videoId)) {
      setInvalid(true);
      return;
    }

    // Numeric → fetch the video
    const loadVideo = async () => {
      try {
        const data = await fetchPrivateVideos(videoId);
        setVideoData(data);
      } catch (error) {
        console.error("Error fetching video:", error);
        setInvalid(true);
      }
    };
    setInvalid(false)
    loadVideo();
  }, [videoId]);

  if (invalid) {
    return <p>Video is not valid or not available.</p>;
  }

  if (!videoData) {
    return <p>Loading lecture video…</p>;
  }

  return (
    <div className="w-full h-full">
      <PrivateVimeoPlayer embedHtml={videoData?.embed?.html} />
    </div>
  );
};

export default VimeoPlayer;
