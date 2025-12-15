import React, { useEffect, useRef, useState } from "react";
import { fetchPrivateVideos } from "./vimeo.js";
import PrivateVimeoPlayer from "./privateVimeoPlayer.jsx";
import { useSelector } from "react-redux"; // Import useSelector
import "./vimeo.css";
import VimeoPlayerWithWatermark from "./privateVimeoPlayer.jsx";
const VimeoPlayer = ({ videoId }) => {
  const [videoData, setVideoData] = useState(null);
  const [invalid, setInvalid] = useState(false);

  // Get user data from Redux
  // const { session } = useSelector((state) => state.auth);
  // const userId = session?.user?.id || "Unknown ID";

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
    setInvalid(false);
    loadVideo();
  }, [videoId]);

  if (invalid) {
    return <p>Video is not valid or not available.</p>;
  }

  if (!videoData) {
    return <p>Loading lecture video…</p>;
  }

  return (
    <div className="w-full h-full relative">
      {/* Pass userId as watermark prop */}
      <PrivateVimeoPlayer embedHtml={videoData?.embed?.html} />
    </div>
  );
};

export default VimeoPlayer;
