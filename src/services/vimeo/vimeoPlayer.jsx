import React, { useEffect, useRef, useState } from "react";
import Player from "@vimeo/player";
import { fetchPrivateVideos } from "./vimeo.js";
import PrivateVimeoPlayer from "./privateVimeoPlayer.jsx";
const VimeoPlayer = ({ videoId  }) => {
  const playerRef = useRef(null);
  const [videoData, setVideoData] = useState(null);
  useEffect(() => {
    const loadVideo = async () => {
      try {
        const data = await fetchPrivateVideos(videoId);
        setVideoData(data || "no data");
      } catch (error) {
        console.error("Error fetching video URL:", error);
      }
    };
    loadVideo();
  }, [videoId]);
  useEffect(() => {
    if (!videoData || playerRef.current) return;
    const player = new Player(playerRef.current, {
      url: videoData,
      width: 200,
      autoplay: false,
    });
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