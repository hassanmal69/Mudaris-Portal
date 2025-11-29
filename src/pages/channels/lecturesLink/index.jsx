import React, { useEffect } from "react";
import { Link as MoizChain, ExternalLink } from "lucide-react";
import { tagColors } from "@/constants/fallbackColors";
import LectureDialog from "@/components/Dialogs/ChannelsDialog/LectureLinks/index.jsx";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  fetchLecturesLink,
  clearLecturesLink,
  deleteLecturesLink,
} from "@/redux/features/lecturesLink/lecturesLinksSlice";
import useInfiniteScroll from "@/hooks/infinteScroll-hook/useInfiniteScroll";
import Actions from "../actions";
import { isAdmin } from "@/constants/constants";
import usePaginatiedList from "@/hooks/infinteScroll-hook/usePaginatedList";
import { useParams } from "react-router-dom";
import { addToast } from "@/redux/features/toast/toastSlice";

const LecturesLink = () => {
  const dispatch = useDispatch();
  const { list: lectures, loading } = useSelector(
    (state) => state.lectureLinks
  );
  const { workspace_id } = useParams();
  const { state, dispatchLocal, runInitialLoad, loadMore, handleDialogChange } =
    usePaginatiedList(
      (payload) => fetchLecturesLink({ workspace_id, ...payload }),
      clearLecturesLink
    );

  // initial Load
  useEffect(() => {
    runInitialLoad(dispatch);
  }, []);
  // dialog refresh logic
  useEffect(() => {
    handleDialogChange(state.dialogOpen || state.editDialogOpen, dispatch);
  }, [state.dialogOpen, state.editDialogOpen]);
  const onEdit = (item) =>
    dispatchLocal({ type: "SELECT_ITEM", payload: item });
  const onDelete = (id) => dispatch(deleteLecturesLink(id));
  const { sentinelRef } = useInfiniteScroll({
    loading,
    hasMore: state.hasMore,
    onLoadMore: () => loadMore(dispatch),
    deps: [state.page],
  });

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
  const handleDelete = (_id) => {
    onDelete(_id);
    dispatch(
      addToast({
        message: "lectures link deleted successfully!",
        type: "destructive",
        duration: 3000,
      })
    );
  };

  if (loading && state.page)
    return (
      <section className="flex justify-center items-center h-40 bg-(--background)">
        <p className="text-(--primary-foreground)">Loading lectures...</p>
      </section>
    );

  return (
    <main className="bg-(--sidebar) h-full">
      <section className="max-w-7xl mx-auto w-full p-4 space-y-4">
        <div className="flex flex-col gap-0 items-center">
          <span className="bg-(--primary) text-(--foreground) w-[65px] rounded-md h-[65px] flex items-center justify-center mb-2">
            <MoizChain className="w-9 h-9" />
          </span>

          {isAdmin && (
            <Button
              variant="secondary"
              size="sm"
              className="text-(--primary-foreground) border-(--border) cursor-pointer border"
              onClick={() => dispatchLocal({ type: "OPEN_DIALOG" })}
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
          <p className="text-(--primary-foreground)">No lectures yet.</p>
        ) : (
          <div className="space-y-4">
            {lectures.map((lecture) => {
              const badgeClass = getColorClass(lecture.tag ?? lecture.id);

              return (
                <div
                  key={lecture.id}
                  className="border group relative border-(--border) gap-2 flex flex-col w-full rounded-2xl bg-(--card) p-4 shadow-sm hover:shadow-md transition-transform duration-200 hover:-translate-y-1"
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
                    className="text-(--primary-foreground) hover:underline mt-2  flex items-center gap-1"
                  >
                    <MoizChain className="w-4 h-4" /> Join Lecture
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  {isAdmin && (
                    <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100  transition-opacity z-50 duration-200">
                      <Actions
                        onEdit={() => onEdit(lecture)}
                        onDelete={() => handleDelete(lecture.id)}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {loading && state.page > 0 && (
          <div className="flex justify-center py-4">
            <div className="w-8 h-8 border-4 border-gray-300 border-t-(--primary) rounded-full animate-spin" />
          </div>
        )}
        <div ref={sentinelRef} className="h-10 w-full" />
        <LectureDialog
          open={state.dialogOpen || state.editDialogOpen}
          onOpenChange={() => dispatchLocal({ type: "CLOSE_DIALOGS" })}
          lecturesLink={state.selectedItem}
        />
      </section>
    </main>
  );
};

export default LecturesLink;
