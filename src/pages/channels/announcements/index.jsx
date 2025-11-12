import React, { useEffect, useRef, useState, useCallback } from "react";
import { supabase } from "@/services/supabaseClient.js";
import { Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";
import AddAnnouncementDialog from "@/components/add-announcement-dialog";

const PAGE_SIZE = 10;

const Announcements = () => {
  const { session } = useSelector((state) => state.auth);
  const isAdmin = session?.user?.user_metadata?.user_role === "admin";

  // pagination / UI state
  const [announcements, setAnnouncements] = useState([]);
  const [page, setPage] = useState(0); // zero-based page index
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  // dialog state (open/close)
  const [dialogOpen, setDialogOpen] = useState(false);
  const openedDialogRef = useRef(false); // track if dialog was opened to trigger refresh on close

  const sentinelRef = useRef(null);
  const observerRef = useRef(null);

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
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) {
        console.error("Supabase fetch announcements error:", error);
        if (!append) setInitialLoading(false);
        else setLoading(false);
        return;
      }

      if (Array.isArray(data)) {
        if (append) {
          setAnnouncements((prev) => [...prev, ...data]);
        } else {
          setAnnouncements(data);
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
      console.error("Unexpected error fetching announcements:", err);
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

  // IntersectionObserver that loads next page when sentinel visible
  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && !loading && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchPage(nextPage, true);
        }
      },
      { root: null, rootMargin: "200px", threshold: 0.1 }
    );

    const current = sentinelRef.current;
    if (current) observerRef.current.observe(current);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [page, loading, hasMore, fetchPage]);

  // when dialog is opened then closed, refresh the list to show newly added announcement
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

  // New: explicit load more handler used by button
  const handleLoadMore = async () => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchPage(nextPage, true);
  };

  // render states
  if (initialLoading)
    return (
      <section className="flex justify-center items-center h-40 bg-(--background)">
        <p className="text-(--muted)">Loading announcements...</p>
      </section>
    );

  return (
    <section className="max-w-4xl mx-auto p-4 space-y-4 ">
      <div className="flex flex-col gap-0 items-center">
        <span className="bg-(--primary) text-(--foreground) w-[65px] rounded-md h-[65px] flex items-center justify-center mb-2">
          <Megaphone className="w-9 h-9" />
        </span>

        {isAdmin && (
          <Button
            variant="secondary"
            size="sm"
            className="text-(--muted-foreground) cursor-pointer border"
            onClick={() => setDialogOpen(true)}
          >
            Add Announcement
          </Button>
        )}

        <h2 className="text-2xl text-(--foreground)">Academy Announcements</h2>
        <p className="text-(--muted-foreground)">
          Stay updated with the latest news, updates, and important information
        </p>
      </div>

      {announcements.length === 0 ? (
        <p className="text-(--muted)">No announcements yet.</p>
      ) : (
        announcements.map((a) => (
          <div
            key={a.id}
            className="border border-(--border) gap-2 flex flex-col
              border-l-4 border-l-(--primary) rounded-2xl bg-(--card) p-4 shadow-sm hover:shadow-md transition-transform duration-200 hover:-translate-y-1"
          >
            <div className="flex flex-col">
              <div className="flex gap-2 items-center">
                <h3 className="text-lg text-(--foreground)">{a.title}</h3>
                <span
                  className={`px-2 text-[12px] py-1 font-medium rounded-md capitalize text-(--primary-foreground) ${
                    a.tag === "important"
                      ? "bg-(--destructive) hover:bg-(--destructive)/90 focus-visible:ring-destructive/20  dark:focus-visible:ring-destructive/40 dark:bg-(--destructive)/60"
                      : a.tag === "update"
                        ? "bg-(--primary)"
                        : a.tag === "event"
                          ? "bg-green-600"
                          : "bg-(--muted)"
                  }`}
                >
                  {a.tag}
                </span>
              </div>
              <p className="text-sm text-(--muted-foreground)">
                {new Date(a.created_at).toLocaleDateString(undefined, {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
            <p className="mb-2 text-(--muted-foreground)">{a.description}</p>
          </div>
        ))
      )}

      {/* sentinel element for IntersectionObserver to trigger loading more */}
      <div ref={sentinelRef} className="w-full h-6" />

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
          {loading
            ? "Loading..."
            : hasMore
              ? "Load more"
              : "No more announcements"}
        </button>
      </div>

      <AddAnnouncementDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </section>
  );
};

export default Announcements;
