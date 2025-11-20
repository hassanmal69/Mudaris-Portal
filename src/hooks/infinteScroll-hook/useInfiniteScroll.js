import { useRef, useEffect } from "react";

export default function useInfiniteScroll({
  loading,
  hasMore,
  onLoadMore,
  root = null,
  rootMargin = "200px",
  threshold = 0.1,
}) {
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);
  const callbackRef = useRef(onLoadMore);

  // Update callback when relevant values change
  useEffect(() => {
    callbackRef.current = () => {
      if (!loading && hasMore) {
        onLoadMore();
      }
    };
  }, [loading, hasMore, onLoadMore]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first?.isIntersecting) {
          callbackRef.current();
        }
      },
      { root, rootMargin, threshold }
    );

    const el = sentinelRef.current;
    if (el) observerRef.current.observe(el);

    return () => observerRef.current?.disconnect();
  }, [root, rootMargin, threshold]);

  return { sentinelRef };
}
