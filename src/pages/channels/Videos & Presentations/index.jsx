import React, { useEffect, useState, Suspense } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import ChapterDialog from "@/components/Dialogs/ChannelsDialog/Videos&Presentations/Chapters";
import VideoDialog from "@/components/Dialogs/ChannelsDialog/Videos&Presentations/Videos";
import { deleteChapterDB, fetchChapters } from "@/redux/features/video&presentations/chapterSlice";
import { fetchVideos } from "@/redux/features/video&presentations/videoSlice";
import { useParams } from "react-router-dom";
import { ChevronDown, ChevronUp, PlayCircle } from "lucide-react";
import { isAdmin } from "@/constants/constants.js";
import Actions from "../actions/index.jsx";

const VideoComponent = React.lazy(() => import("./VideoComponent.jsx"));

const VideosPresentations = () => {
  const dispatch = useDispatch();
  const { workspace_id } = useParams();

  // const { session } = useSelector((state) => state.auth);

  // CACHED chapters (by workspace)
  const chapters =
    useSelector(
      (state) => state.chapters.chaptersByWorkspace[workspace_id]
    ) || [];

  // CACHED videos (by chapter)
  const videosByChapter = useSelector(
    (state) => state.videos.videosByChapter
  );

  const [expandedChapter, setExpandedChapter] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [activeChapter, setActiveChapter] = useState(null);
  const [editingChapter, setEditingChapter] = useState(null);

  // Fetch chapters (only once thanks to caching)
  useEffect(() => {
    dispatch(fetchChapters(workspace_id));
  }, [workspace_id, dispatch]);

  const handleSeeVideos = (chapterId) => {
    const cached = videosByChapter[chapterId];

    if (!cached) {
      dispatch(fetchVideos(chapterId)); // Load only if missing
    }

    setExpandedChapter((prev) => (prev === chapterId ? null : chapterId));
  };

  const handleDialogChange = (isOpen) => {
    setChapterDialogOpen(isOpen);
    if (!isOpen) setEditingChapter(null);
  };

  const onEdit = (chapter) => {
    setEditingChapter(chapter);
    setChapterDialogOpen(true);
  };

  // dispatchLocal({ type: "SELECT_ITEM", payload: item });
  const onDelete = (id) => dispatch(deleteChapterDB(id))

  const handleAddVideo = (chapterId) => {
    setActiveChapter(chapterId);
    setVideoDialogOpen(true);
  };

  return (
    <div className="bg-(--background) text-(--foreground) p-4 flex gap-6">
      {isAdmin &&
        <Button onClick={() => setChapterDialogOpen(true)}>
          add chapter
        </Button>
      }
      {/* LEFT SIDEBAR */}
      <div className="mt-4 w-[35%] h-dvh overflow-y-scroll scroll-smooth">
        {chapters.map((chapter, idx) => {
          const chapterVideos = videosByChapter[chapter.id] || [];

          return (
            <div key={chapter.id} className="flex flex-col relative">
              {/* Chapter Header */}

              <div className="flex p-4 gap-1 hover:bg-(--sidebar-accent)
                              items-center border-2 border-(--sidebar-border)">
                <Button onClick={() => handleSeeVideos(chapter.id)}>
                  {expandedChapter === chapter.id
                    ? <ChevronUp size={18} />
                    : <ChevronDown size={18} />}
                </Button>

                <h2 className="text-lg">{idx + 1}. {chapter.name}</h2>
                {isAdmin && (
                  <div className="flex h-full justify-end absolute right-4">
                    <Actions
                      onEdit={() => onEdit(chapter)}
                      onAdd={() => handleAddVideo(chapter.id)}
                      onDelete={() => onDelete(chapter.id)}
                    />
                  </div>
                )}
              </div>

              {/* Videos List */}
              {expandedChapter === chapter.id && (
                <ul className="space-y-1 bg-(--border)">
                  {chapterVideos.map((video, i) => (
                    <li
                      key={video.id}
                      className="text-sm text-(--muted-foreground)
                                 hover:bg-(--sidebar-accent) p-4 px-6
                                 flex gap-2 cursor-pointer"
                      onClick={() =>
                        setSelectedVideo({ video, index: i, allVideos: chapterVideos, chp: chapter.name })
                      }
                    >
                      <PlayCircle className="h-5 w-5" />
                      <strong className="text-base">
                        {i + 1}. {video.name}
                      </strong>
                    </li>
                  ))}

                  {chapterVideos.length === 0 && (
                    <li className="p-4 text-sm opacity-50 italic">
                      No videos yet.
                    </li>
                  )}
                </ul>
              )}
            </div>
          );
        })}
      </div>

      {/* RIGHT SIDE: VIDEO PLAYER */}
      <Suspense fallback={<div>Loading video...</div>}>
        {selectedVideo && <VideoComponent data={selectedVideo}
          onNext={setSelectedVideo}
        />}
      </Suspense>

      {/* Dialogs */}
      <ChapterDialog
        open={chapterDialogOpen}
        editingData={editingChapter}
        onOpenChange={handleDialogChange}
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
