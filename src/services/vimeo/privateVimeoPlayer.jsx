import React, { useEffect, useRef, useState } from "react";
import "./vimeo.css";
import { useSelector } from "react-redux";
import { FullscreenIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivateVimeoPlayer = ({ embedHtml }) => {
  const { session } = useSelector((state) => state.auth);
  const id = session?.user?.id || "Unknown ID";
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 600);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  console.log(isMobile, "screen");
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);

  // === Draw Watermark ===
  const drawWatermark = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = 0.5;
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";

    ctx.fillText(id, canvas.width / 2, canvas.height / 2);
  };

  // === Resize Canvas ===
  const resizeCanvas = () => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;

    if (canvas && wrapper) {
      canvas.width = wrapper.clientWidth;
      canvas.height = wrapper.clientHeight;
      drawWatermark();
    }
  };

  // === Initial size + redraw on user change ===
  useEffect(() => {
    resizeCanvas();
  }, [id, isFullscreen]);

  // === Resize + fullscreen listeners ===
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      wrapperRef.current.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }

  return (
    <div
      ref={wrapperRef}
      className="video-container relative w-full h-full overflow-hidden"
    >
      {/* Watermark Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-50 pointer-events-none"
      />

      {/* Vimeo Embed */}
      <div className="w-full h-full relative">
        <div
          className="absolute video-wrapper inset-0 h-full w-full z-10"
          dangerouslySetInnerHTML={{ __html: embedHtml }}
        />
        <div className="w-full h-full absolute flex justify-end items-end sm:items-center sm:justify-center">
          {isMobile ? (
            <Button
              variant={"success"}
              className="text-sm z-50 mb-1  w-[99%] mr-0.5 font-medium  relative transition-colors duration-200 ease-in-out"
            >
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </Button>
          ) : (
            <button
              onClick={toggleFullscreen}
              className={` transition-colors duration-200 ease-in-out
    ${isFullscreen ? "fullscreen-button" : "screen-button"}`}
            >
              <FullscreenIcon
                className={`${isFullscreen ? "w-10 h-10" : "w-8 h-8"}`}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrivateVimeoPlayer;
