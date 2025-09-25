import React, { useEffect, useRef } from "react";
import Player from "@vimeo/player";

const VimeoPlayer = ({ videoId }) => {
  const playerRef = useRef(null);

  useEffect(() => {
    if (!playerRef.current) return;

    const player = new Player(playerRef.current, {
      id: videoId,
      width: 640,
      // optional: hide controls
      controls: true,
    });

    player.on("play", function () {
      console.log("Video played");
    });

    return () => {
      player.destroy();
    };
  }, [videoId]);

  return <div ref={playerRef}></div>;
};

export default VimeoPlayer;
