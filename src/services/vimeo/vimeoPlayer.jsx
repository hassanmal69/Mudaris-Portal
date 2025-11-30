import React, { useEffect, useRef, useState } from "react";
import Player from "@vimeo/player";
import { fetchPrivateVideos } from "./vimeo.js";
import PrivateVimeoPlayer from "./privateVimeoPlayer.jsx";
const VimeoPlayer = ({ videoId, videoDuration }) => {
  const playerRef = useRef(null);
  const [videoData, setVideoData] = useState(null);
  useEffect(() => {
    const loadVideo = async () => {
      try {
        const data = await fetchPrivateVideos(videoId);
        console.log("data", data.embed.html);
        setVideoData(data || "no data");
      } catch (error) {
        console.error("Error fetching video URL:", error);
      }
    };
    loadVideo();
  }, [videoId]);
  function formatToHHMMSS(seconds) {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    videoDuration(`${h}:${m}:${s}`)
  }

  useEffect(() => {
    if (!videoData || playerRef.current) return;
    const player = new Player(playerRef.current, {
      url: videoData,
      width: 200,
      autoplay: false,
    });
    formatToHHMMSS(videoData.duration)
    player.on("play", () => console.log("video played"));
    player.on("pause", () => console.log("video paused"));
    return () => player.destroy();
  }, [videoData]);
  return (
    <div className='w-full h-full'>
      {!videoData && <p>Loading lecture video</p>}
      <div ref={playerRef}></div>
      <PrivateVimeoPlayer embedHtml={videoData?.embed.html} />
    </div>
  );
};

export default VimeoPlayer;
