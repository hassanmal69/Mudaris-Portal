import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link as MoizChain, ExternalLink } from "lucide-react";
import { tagColors } from "@/constants/fallbackColors";
import LectureDialog from "@/components/Dialogs/channelsDialog/LectureLinks/index.jsx";
import { useSelector,useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  fetchLecturesLink,
  clearLecturesLink,
  deleteLecturesLink,
} from "@/redux/features/lecturesLink/lecturesLinksSlice";
import useInfiniteScroll from "@/hooks/infinteScroll-hook/useInfiniteScroll";
import Actions from "../actions";

const PAGE_SIZE = 10;

const LecturesLink = () => {
  const dispatch = useDispatch();
  const { session } = useSelector((state) => state.auth);
  const { list: lectures, loading } = useSelector(
    (state) => state.lectureLinks
  );

  const isAdmin = session?.user?.user_metadata?.user_role === "admin";
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedLectureLink, setSeletedLecturesLink] = useState(null);
  const openEditDialog = (lecture) => {
    setSeletedLecturesLink(lecture);
    setEditDialogOpen(true);
  };
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  // 👉 Prevent initial fetch from running twice (Strict Mode)
  const initialLoadRef = useRef(false);
  const openedDialogRef = useRef(false);

  const fetchPage = useCallback(
    async (pageIndex = 0) => {
      const from = pageIndex * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;

      try {
        const data = await dispatch(fetchLecturesLink({ from, to })).unwrap();
        setHasMore(data.length === PAGE_SIZE);
      } catch (err) {
        console.error("Unexpected error fetching lectures:", err);
        setHasMore(false);
      }
    },
    [dispatch]
  );

  // 👉 Initial load - only ONCE
  useEffect(() => {
    if (initialLoadRef.current) return;
    initialLoadRef.current = true;

    dispatch(clearLecturesLink());
    fetchPage(0);
    setPage(0);
  }, [fetchPage, dispatch]);

  // Load more
  const handleLoadMore = useCallback(() => {
    const next = page + 1;
    setPage(next);
    fetchPage(next);
  }, [page, fetchPage]);

  const { sentinelRef } = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: handleLoadMore,
    deps: [page],
  });

  // 👉 Refresh only when dialog closes (NOT on mount)
  const wasOpenRef = useRef(false);
  const handleDelete = (id) => {
    alert("this action can not be undone");
    dispatch(deleteLecturesLink(id));
  };
  useEffect(() => {
    // opening
    if (dialogOpen) {
      wasOpenRef.current = true;
      return;
    }

    // closing → refresh list
    if ((!dialogOpen && openedDialogRef.current) || wasOpenRef.current) {
      wasOpenRef.current = false;

      dispatch(clearLecturesLink());
      setPage(0);
      setHasMore(true);
      fetchPage(0);
    }
  }, [dialogOpen, fetchPage, dispatch]);

  // Color
  const getColorClass = (id) => {
    const s = String(id ?? "");
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = (hash << 5) - hash + s.charCodeAt(i);
      hash |= 0;
    }
    return tagColors[Math.abs(hash) % tagColors.length];
  };

  if (loading && page === 0)
    return (
      <section className="flex justify-center items-center h-40 bg-(--background)">
        <p className="text-(--muted)">Loading lectures...</p>
      </section>
    );

  return (
    <section className="max-w-7xl mx-auto w-full p-4 space-y-4">
      <div className="flex flex-col gap-0 items-center">
        <span className="bg-(--primary) text-(--foreground) w-[65px] rounded-md h-[65px] flex items-center justify-center mb-2">
          <MoizChain className="w-9 h-9" />
        </span>

        {isAdmin && (
          <Button
            variant="secondary"
            size="sm"
            className="text-(--muted-foreground) cursor-pointer border"
            onClick={() => setDialogOpen(true)}
          >
            Add links
          </Button>
        )}

        <h2 className="text-2xl text-(--foreground)">Lecture Links</h2>
        <p className="text-(--muted-foreground)">
          Access all live sessions, webinars, and recorded lectures
        </p>
      </div>

      {lectures.length === 0 ? (
        <p className="text-(--muted)">No lectures yet.</p>
      ) : (
        <div className="space-y-4">
          {lectures.map((lecture) => {
            const badgeClass = getColorClass(lecture.tag ?? lecture.id);

            return (
              <div
                key={lecture.id}
                className="border border-(--border) gap-2 flex flex-col w-full rounded-2xl bg-(--card) p-4 shadow-sm hover:shadow-md transition-transform duration-200 hover:-translate-y-1"
              >
                <div className="flex gap-2">
                  {lecture.tag && (
                    <span
                      className={`px-2 text-[12px] py-1 font-medium rounded-md capitalize ${badgeClass}`}
                    >
                      {lecture.tag}
                    </span>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(lecture.lecture_date).toLocaleDateString(
                      undefined,
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>
                </div>

                <h3 className="text-xl font-semibold text-(--foreground)">
                  {lecture.title}
                </h3>
                <p className="text-(--muted-foreground)">
                  {lecture.description}
                </p>

                <a
                  href={lecture.lecture_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--primary) hover:underline mt-2  flex items-center gap-1"
                >
                  <MoizChain className="w-4 h-4" /> Join Lecture
                  <ExternalLink className="w-4 h-4" />
                </a>
                {isAdmin && (
                  <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Actions
                      onEdit={() => openEditDialog(lecture)}
                      onDelete={() => handleDelete(lecture.id)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {loading && page > 0 && (
        <div className="flex justify-center py-4">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-[--primary] rounded-full animate-spin" />
        </div>
      )}
      <div className="flex justify-center mt-2">
        <Button
          type="button"
          onClick={handleLoadMore}
          disabled={loading || !hasMore}
          className={`px-4 py-2 rounded-md text-sm font-medium transition
            ${loading || !hasMore ? "bg-gray-600 text-gray-300 cursor-not-allowed" : "bg-[--primary] text-white hover:opacity-90"}`}
        >
          {loading
            ? "Loading..."
            : hasMore
              ? "Load more"
              : "No more lectures link"}
        </Button>
      </div>
      <div ref={sentinelRef} className="w-full h-6" />

      <LectureDialog
        open={dialogOpen || editDialogOpen}
        onOpenChange={() => {
          setDialogOpen(false);
          setEditDialogOpen(false);
          setSeletedLecturesLink(null);
        }}
        lecturesLink={selectedLectureLink}
      />
    </section>
  );
};

export default LecturesLink;
