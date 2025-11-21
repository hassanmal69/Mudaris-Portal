import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import ChapterDialog from "@/components/Dialogs/ChannelsDialog/Videos&Presentations/Chapters";
import VideoDialog from "@/components/Dialogs/ChannelsDialog/Videos&Presentations/Videos";
import { fetchChapters } from "@/redux/features/video&presentations/chapterSlice";
import { fetchVideos } from "@/redux/features/video&presentations/videoSlice";
import { useParams } from "react-router-dom";

const VideosPresentations = () => {
  const { session } = useSelector((state) => state.auth);

  const { list: videosList = [] } = useSelector((state) => state.videos || {});

  const dispatch = useDispatch();
  const { workspace_id } = useParams();

  const [chapters, setChapters] = useState([]);
  const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState(null);
  const [expandedChapter, setExpandedChapter] = useState(null);

  const fetchData = async () => {
    const data = await dispatch(fetchChapters(workspace_id));
    setChapters(data?.payload);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddVideo = (chapterId) => {
    setActiveChapter(chapterId);
    setVideoDialogOpen(true);
  };

  const handleSeeVideos = async (chapterId) => {
    await dispatch(fetchVideos(chapterId)); // fetch into Redux
    setExpandedChapter(expandedChapter === chapterId ? null : chapterId);
  };

  return (
    <div className="bg-(--background) text-(--foreground) h-dvh p-4">
      <div className="flex w-full items-center justify-center">
        {session.user.user_metadata.user_role === "admin" && (
          <Button
            variant="default"
            size="sm"
            className="mt-2 bg-[#eee] text-[#2b092b] p-3 flex items-center gap-2 justify-center hover:bg-transparent hover:text-white hover:border-[#fff] transition-all delay-150 duration-300 border"
            onClick={() => setChapterDialogOpen(true)}
          >
            Enter New Courses
          </Button>
        )}
      </div>

      <div className="mt-4 space-y-4">
        {chapters.map((chapter, i) => (
          <div key={chapter?.id} className="flex flex-col gap-2">
            <div className="flex gap-2 items-center">
              <h2>
                {i + 1}. {chapter?.name}
              </h2>

              <Button onClick={() => handleSeeVideos(chapter.id)}>
                {expandedChapter === chapter.id ? "Hide Videos" : "See Videos"}
              </Button>

              {session.user.user_metadata.user_role === "admin" && (
                <Button onClick={() => handleAddVideo(chapter.id)}>
                  Add Video
                </Button>
              )}
            </div>

            {expandedChapter === chapter.id && videosList.length > 0 && (
              <ul className="ml-6 mt-2 space-y-1">
                {videosList
                  .filter((video) => video.chapter_id === chapter.id)
                  .map((video) => (
                    <li
                      key={video.id}
                      className="text-sm text-(--muted-foreground)"
                    >
                      <strong>{video.name}</strong> — {video.description} |
                      <a
                        href={video.video_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-500 ml-1"
                      >
                        Video
                      </a>{" "}
                      |
                      {video.presentation_link && (
                        <a
                          href={video.presentation_link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-500 ml-1"
                        >
                          Presentation
                        </a>
                      )}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <ChapterDialog
        open={chapterDialogOpen}
        onOpenChange={setChapterDialogOpen}
      />
      {activeChapter && (
        <VideoDialog
          chapterId={activeChapter}
          open={videoDialogOpen}
          onOpenChange={setVideoDialogOpen}
        />
      )}
    </div>
  );
};

export default VideosPresentations;
