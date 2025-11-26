import React from "react";
import { Button } from "@/components/ui/button";
import VimeoPlayer from "@/services/vimeo/vimeoPlayer";
const VideoComponent = React.memo(
  ({ data }) => {
    const { video, chp } = data || {};
    if (!video) {
      return (
        <div className="flex items-center justify-center w-full h-full text-(--muted-foreground)">
          Select a video to begin.
        </div>
      );
    }
    return (
      <div className="w-full h-full p-6 space-y-6">
        {/* === VIDEO PLAYER === */}
        <div className="w-full h-[350px] bg-black rounded-lg overflow-hidden">
          <VimeoPlayer videoId={video?.video_link} />
        </div>
        {/* === INFO CARD === */}
        <div className="bg-(--card) text-(--card-foreground) p-6 rounded-lg shadow-sm space-y-4">
          <p className="text-sm text-(--muted-foreground)">
            {chp || "Course Module"}
          </p>
          <h2 className="text-xl font-bold">{video.name}</h2>
          <p className="text-sm text-(--muted-foreground)">
            Duration: {video.duration || "—"}
          </p>
          <p className="leading-relaxed text-(--foreground)">
            {video.description}
          </p>
          {video.presentation_link && (
            <a
              href={video.presentation_link}
              target="_blank"
              rel="noreferrer"
              className="text-(--primary) underline text-sm flex items-center gap-2"
            >
              📥 Download the Presentation
            </a>
          )}
        </div>

        {/* === ACTION BUTTONS === */}
        <div className="flex items-center gap-4">
          <Button className="bg-(--primary) text-(--primary-foreground)">
            Mark as Complete
          </Button>

          <Button
            variant="outline"
            className="text-(--foreground) border-(--border)"
          >
            Next Lesson →
          </Button>
        </div>
      </div>
    );
  },
  (prev, next) =>
    prev?.data?.video?.id === next?.data?.video?.id &&
    prev?.data?.chp === next?.data?.chp
);

export default VideoComponent;
