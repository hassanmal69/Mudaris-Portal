import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import VimeoPlayer from "@/services/vimeo/vimeoPlayer";
import { useDispatch, useSelector } from "react-redux";
import { fetchMarkasComplete, markVideoComplete } from "@/redux/features/video&presentations/markcompleteSlice";

const VideoComponent = React.memo(
  ({ data, onNext }) => {
    const { video, chp, index, allVideos } = data || {};
    const { session } = useSelector((state) => state.auth);
    const dispatch = useDispatch()
    const [duration, setDuration] = useState('')
    const nextVideo = useMemo(() => {
      if (!allVideos || index === undefined) return null;
      return allVideos[index + 1] || null;
    }, [allVideos, index]);
    const handleCompleteLogic = async () => {
      dispatch(markVideoComplete({ userId: session.user.id, videoId: video.id }));
    }
    useEffect(() => {
      if (session?.user?.id) {
        dispatch(fetchMarkasComplete(session.user.id));
      }
    }, [session?.user?.id, dispatch]);
    const { completedVideos } = useSelector((state) => state.markComplete);
    const isCompleted = video && completedVideos.includes(video.id);
    const videoDuration = (dur) => {
      setDuration(dur)
    }
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
          <VimeoPlayer videoId={video?.video_link} videoDuration={videoDuration} />
        </div>

        {/* === INFO CARD === */}
        <div className="bg-(--card) text-(--card-foreground) p-6 rounded-lg shadow-sm space-y-4">
          <p className="text-sm text-(--muted-foreground)">
            {chp || "Course Module"}
          </p>

          <h2 className="text-xl font-bold">{video.name}</h2>

          <p className="text-sm text-(--muted-foreground)">
            Duration: {duration}
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
          <Button onClick={handleCompleteLogic} disabled={isCompleted}>
            {isCompleted ? "✅ Completed" : "Mark as Complete"}
          </Button>
          <Button
            variant="outline"
            disabled={!nextVideo}
            className="text-(--foreground) border-(--border)"
            onClick={() => {
              if (nextVideo) {
                onNext({
                  video: nextVideo,
                  chp,
                  index: index + 1,
                  allVideos,
                });
              }
            }}
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
