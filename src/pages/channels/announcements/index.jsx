import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import AddAnnouncementDialog from "@/components/Dialogs/ChannelsDialog/Announcements/index.jsx";
import {
  clearAnnouncements,
  fetchAnnouncements,
} from "@/redux/features/announcements/announcementsSlice";
import Actions from "../actions";
import useInfiniteScroll from "@/hooks/infinteScroll-hook/useInfiniteScroll";
import { deleteAnnouncementDB } from "@/redux/features/announcements/announcementsSlice";
import { useIsAdmin } from "@/constants/constants.js";
import { useParams } from "react-router-dom";
import usePaginatiedList from "@/hooks/infinteScroll-hook/usePaginatedList";
import { addToast } from "@/redux/features/toast/toastSlice";

const Announcements = () => {
  const dispatch = useDispatch();

  const { list: announcements, loading } = useSelector(
    (state) => state.announcements
  );
  const { workspace_id } = useParams();
  const isAdmin = useIsAdmin();

  const { state, dispatchLocal, runInitialLoad, loadMore, handleDialogChange } =
    usePaginatiedList(
      (payload) => fetchAnnouncements({ workspace_id, ...payload }),
      clearAnnouncements
    );
  // initial Load
  useEffect(() => {
    runInitialLoad(dispatch);
  }, []);
  useEffect(() => {
    handleDialogChange(state.dialogOpen || state.editDialogOpen, dispatch);
  }, [state.dialogOpen, state.editDialogOpen]);
  const onEdit = (item) =>
    dispatchLocal({ type: "SELECT_ITEM", payload: item });
  const handleDelete = (_idx) => {
    dispatch(deleteAnnouncementDB(_idx));
    dispatch(
      addToast({
        message: "Annoucement has deleted successfully!",
        type: "destructive",
        duration: 3000,
      })
    );
  };

  const { sentinelRef } = useInfiniteScroll({
    loading,
    hasMore: state.hasMore,
    onLoadMore: () => loadMore(dispatch),
    deps: [state.page],
  });

  // explicit load more

  if (loading && state.page === 0)
    return (
      <section className="flex justify-center items-center h-40 bg-(--background)">
        <p className="text-(--muted)">Loading announcements...</p>
      </section>
    );

  return (
    <main className="bg-(--sidebar) h-full">
      <section className=" max-w-7xl mx-auto w-full p-4 space-y-4">
        <div className="flex flex-col gap-0 items-center">
          <span className="bg-(--primary) text-(--foreground) w-[65px] rounded-md h-[65px] flex items-center justify-center mb-2">
            <Megaphone className="w-9 h-9" />
          </span>

          {isAdmin && (
            <Button
              variant="secondary"
              size="sm"
              className="text-(--primary-foreground) border-(--border) cursor-pointer border"
              onClick={() => dispatchLocal({ type: "OPEN_DIALOG" })}
            >
              Add Announcement
            </Button>
          )}

          <h2 className="text-2xl text-(--foreground)">
            Academy Announcements
          </h2>
          <p className="text-(--muted-foreground)">
            Stay updated with the latest news, updates, and important
            information
          </p>
        </div>

        {announcements.length === 0 ? (
          <p className="text-(--muted)">No announcements yet.</p>
        ) : (
          announcements.map((a) => (
            <div
              key={a.id}
              className="group border border-(--border) gap-2 flex flex-col
      border-l-4 border-l-(--standard) rounded-2xl bg-(--card) p-4 shadow-sm hover:shadow-md transition-transform duration-200 hover:-translate-y-1 relative"
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
                            ? "bg-(--success)"
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

              {isAdmin && (
                <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Actions
                    onEdit={() => onEdit(a)}
                    onDelete={() => handleDelete(a.id)}
                  />
                </div>
              )}
            </div>
          ))
        )}

        {loading && state.page > 0 && (
          <div className="flex justify-center py-4">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-[--primary] rounded-full animate-spin" />
          </div>
        )}

        {/* <div className="flex justify-center mt-2">
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
      </div> */}
        <div ref={sentinelRef} className="w-full h-6" />

        <AddAnnouncementDialog
          open={state.dialogOpen || state.editDialogOpen}
          onOpenChange={() => dispatchLocal({ type: "CLOSE_DIALOGS" })}
          announcement={state.selectedItem}
        />
      </section>
    </main>
  );
};

export default Announcements;
