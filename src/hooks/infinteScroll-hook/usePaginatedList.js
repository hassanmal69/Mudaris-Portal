import {
  channel_initialState,
  local_channel_reducer,
  CHANNEL_PAGE_SIZE,
} from "@/pages/channels/localReducer";
import { useCallback, useReducer, useRef, useState } from "react";

export default function usePaginatiedList(fetchAction, clearAction) {
  const [loading, setLoading] = useState(false);
  const initialLoadRef = useRef(false);

  const [state, dispatchLocal] = useReducer(
    local_channel_reducer,
    channel_initialState
  );

  const openDialogRef = useRef(false);
  const fetchPage = useCallback(
    async (reduxDispatch, pageIndex = 0) => {
      setLoading(true);
      const from = pageIndex * CHANNEL_PAGE_SIZE;
      const to = from + CHANNEL_PAGE_SIZE - 1;
      try {
        const data = await reduxDispatch(fetchAction({ from, to })).unwrap();
        dispatchLocal({
          type: "SET_HAS_MORE",
          payload: data.length === CHANNEL_PAGE_SIZE,
        });
      } catch (error) {
        console.error("fetch error", error);
        dispatchLocal({ type: "SET_HAS_MORE", payload: false });
      } finally {
        setLoading(false);
      }
    },
    [fetchAction]
  );

  // initial load only once

  const runInitialLoad = useCallback(
    (reduxDispatch) => {
      if (initialLoadRef.current) return; // prevent double call
      initialLoadRef.current = true; // mark as loaded
      fetchPage(reduxDispatch, 0);
      dispatchLocal({ type: "SET_PAGE", payload: 0 });
      dispatchLocal({ type: "INITIAL_LOADED" });
    },
    [fetchPage]
  );

  // load more
  const loadMore = useCallback(
    (reduxDispatch) => {
      if (!state.hasMore || loading) return;
      const next = state.page + 1;
      dispatchLocal({ type: "SET_PAGE", payload: next });
      fetchPage(reduxDispatch, next);
    },
    [state.page, state.hasMore, loading, fetchPage]
  );

  // refresh after dialog close
  const handleDialogChange = useCallback(
    (isOpen, reduxDispatch) => {
      if (isOpen) {
        openDialogRef.current = true;
        return;
      }
      if (openDialogRef.current) {
        openDialogRef.current = false;
        reduxDispatch(clearAction());
        dispatchLocal({
          type: "SET_PAGE",
          payload: 0,
        });
        dispatchLocal({ type: "SET_HAS_MORE", payload: true });
        fetchPage(reduxDispatch, 0);
      }
    },
    [fetchPage]
  );
  return {
    state,
    dispatchLocal,
    runInitialLoad,
    loadMore,
    handleDialogChange,
  };
}
