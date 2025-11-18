import React, { useEffect, useState, useCallback, useRef } from "react";
import { supabase } from "@/services/supabaseClient.js";
import { Link as MoizChain, ExternalLink } from "lucide-react";
import { tagColors } from "@/constants/fallbackColors";
import LectureDialog from "@/components/Dialogs/ChannelsDialog/LectureLinks";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

const LecturesLink = () => {
  const { session } = useSelector((state) => state.auth);
  const isAdmin = session?.user?.user_metadata?.user_role === "admin";
  const [lectures, setLectures] = useState([]);
  const [page, setPage] = useState(0); // zero-based page index
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const openedDialogRef = useRef(false); // track if dialog was opened to trigger refresh on close

  const fetchPage = useCallback(async (pageIndex = 0, append = false) => {
    const from = pageIndex * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    try {
      if (!append) {
        setInitialLoading(true);
      } else {
        setLoading(true);
      }

      const { data, error } = await supabase
        .from("lectures")
        .select("*")
        .order("lecture_date", { ascending: false })
        .range(from, to);

      if (error) {
        console.error("Error fetching lectures:", error);
        if (!append) setInitialLoading(false);
        else setLoading(false);
        return;
      }

      if (Array.isArray(data)) {
        if (append) {
          setLectures((prev) => [...prev, ...data]);
        } else {
          setLectures(data);
        }

        // if returned less than page size, there is no more data
        if (data.length < PAGE_SIZE) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Unexpected error fetching lectures:", err);
      setHasMore(false);
    } finally {
      setInitialLoading(false);
      setLoading(false);
    }
  }, []);

  // initial load
  useEffect(() => {
    fetchPage(0, false);
    setPage(0);
  }, [fetchPage]);
  useEffect(() => {
    if (dialogOpen) {
      openedDialogRef.current = true;
      return;
    }

    if (!dialogOpen && openedDialogRef.current) {
      // dialog was open and now closed -> refresh list (reload first page)
      openedDialogRef.current = false;
      setPage(0);
      setHasMore(true);
      fetchPage(0, false);
    }
  }, [dialogOpen, fetchPage]);

  // helper: produce an index from an id so color is stable per lecture
  const getColorClass = (id) => {
    const s = String(id ?? "");
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = (hash << 5) - hash + s.charCodeAt(i);
      hash |= 0;
    }
    const idx = Math.abs(hash) % tagColors.length;
    return tagColors[idx];
  };
  // Load more handler
  const handleLoadMore = async () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchPage(nextPage, true);
  };
  const hanlelcick = () => {
    console.log("clicked");
    console.log(dialogOpen);
  };

  // render states
  if (initialLoading)
    return (
      <section className="flex justify-center items-center h-40 bg-(--background)">
        <p className="text-(--muted)">Loading lectures...</p>
      </section>
    );
  return (
    <section className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex flex-col gap-0 items-center">
        <span className="bg-(--primary) text-(--foreground) w-[65px] rounded-md h-[65px] flex items-center justify-center mb-2">
          <MoizChain className="w-9 h-9" />
        </span>
        {/* {isAdmin && ( */}
        <Button
          variant="secondary"
          size="sm"
          className="text-(--muted-foreground) cursor-pointer border"
          onClick={() => setDialogOpen(true)}
        >
          Add links
        </Button>
        {/* )} */}
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
            // compute color class for this lecture's tag
            const badgeClass = getColorClass(lecture.tag ?? lecture.id);

            return (
              <div
                key={lecture.id}
                className="border border-(--border) gap-2 flex flex-col rounded-2xl bg-(--card) p-4 shadow-sm hover:shadow-md transition-transform duration-200 hover:-translate-y-1"
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
              </div>
            );
          })}
        </div>
      )}

      {/* loading spinner for subsequent pages */}
      {loading && (
        <div className="flex justify-center py-4">
          <div className="w-8 h-8 border-4 border-gray-300 border-t-[--primary] rounded-full animate-spin" />
        </div>
      )}

      {/* Load more button (explicit control) */}
      <div className="flex justify-center mt-2">
        <button
          type="button"
          onClick={handleLoadMore}
          disabled={loading || !hasMore}
          className={`px-4 py-2 rounded-md text-sm font-medium transition
            ${loading || !hasMore ? "bg-gray-600 text-gray-300 cursor-not-allowed" : "bg-[--primary] text-white hover:opacity-90"}`}
        >
          {loading ? "Loading..." : hasMore ? "Load more" : "No more lectures"}
        </button>
      </div>
      <LectureDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </section>
  );
};

export default LecturesLink;
