import React, { useEffect, useRef } from "react";
import "./vimeo.css";
import { useSelector } from "react-redux";

const PrivateVimeoPlayer = ({ embedHtml }) => {
  const { session } = useSelector((state) => state.auth);
  const id = session?.user?.id || "Unknown ID";

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

    ctx.fillText(id, canvas.width / 2, canvas.height - 30);
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
  }, [id]);

  // === Resize + fullscreen listeners ===
  useEffect(() => {
    const handler = () => setTimeout(resizeCanvas, 150);

    window.addEventListener("resize", handler);
    document.addEventListener("fullscreenchange", handler);

    return () => {
      window.removeEventListener("resize", handler);
      document.removeEventListener("fullscreenchange", handler);
    };
  }, []);

  // === Intercept Vimeo fullscreen and apply it on WRAPPER ===
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const iframe = wrapperRef.current?.querySelector("iframe");

      iframe.allow = "fullscreen";

      iframe.addEventListener("fullscreenchange", () => {
        wrapperRef.current?.requestFullscreen?.();
      });
    });

    observer.observe(wrapperRef.current, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="video-wrapper relative w-full h-full overflow-hidden"
    >
      {/* Watermark Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-50 pointer-events-none"
      />

      {/* Vimeo Embed */}
      <div
        className="absolute inset-0 z-10"
        dangerouslySetInnerHTML={{ __html: embedHtml }}
      />
    </div>
  );
};

export default PrivateVimeoPlayer;
