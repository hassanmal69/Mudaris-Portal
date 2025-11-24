import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";

// Convert any YouTube URL format → safe embed URL
const toEmbedUrl = (url) => {
  if (!url) return null;

  try {
    // Short links
    if (url.includes("youtu.be")) {
      const id = url.split("/").pop().split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    // Regular watch links
    if (url.includes("watch?v=")) {
      const id = new URL(url).searchParams.get("v");
      return `https://www.youtube.com/embed/${id}`;
    }

    // Shorts
    if (url.includes("/shorts/")) {
      const id = url.split("/shorts/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${id}`;
    }

    return url;
  } catch (e) {
    console.warn("Invalid YouTube URL", url);
    return null;
  }
};

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

    const embedUrl = useMemo(() => toEmbedUrl(video.video_url), [video.video_url]);

    return (
      <div className="w-full h-full p-6 space-y-6">

        {/* === VIDEO PLAYER === */}
        <div className="w-full h-[350px] bg-black rounded-lg overflow-hidden">
          {embedUrl ? (
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title={video.name}
              loading="lazy"
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              sandbox="allow-scripts allow-same-origin allow-presentation"
              onError={() => console.error("Video could not load")}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white">
              Unable to load video.
            </div>
          )}
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
