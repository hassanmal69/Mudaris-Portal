import React, { useEffect, useState, useRef } from "react";
import { supabase } from "@/services/supabaseClient";
import TradingViewTicker from "./component/TradingViewTicker";
import TradingViewMiniChart from "./component/TradingViewMiniChart";
import TradingViewHotlist from "./component/TradingViewHotlist";
import TradingViewHeatmap from "./component/TradingViewHeatmap";
import TradingViewCryptoHeatmap from "./component/TradingViewCryptoHeatmap";
import TradingViewTimeline from "./component/TradingViewTimeline";
import FeaturedCarousel from "./component/FeaturedCarousel";
import "./market.css";
/*
  Market.jsx
  - MasonryGrid (CSS columns)
  - FeaturedSlider (horizontal scroll snap)
  - PostCard (thumbnail + meta)
  - SkeletonCard
  - PostModal (lazy loads iframe)
*/

/* ---------- PostModal ---------- */
const PostModal = ({ open, onClose, url, title }) => {
  // only set iframe src when open to avoid load cost
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (open && url) {
      // small microtask delay to allow overlay animation first
      const t = setTimeout(() => setSrc(url), 80);
      return () => clearTimeout(t);
    } else {
      setSrc(null);
    }
  }, [open, url]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title || "Post preview"}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      {/* backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
      />

      {/* modal content */}
      <div className="relative z-10 w-full max-w-5xl h-[80vh] rounded-(--radius) overflow-hidden shadow-2xl border border-(--border) bg-(--card)">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-(--border)">
          <div className="text-(--card-foreground) font-medium">{title}</div>
          <button
            onClick={onClose}
            aria-label="Close preview"
            className="px-3 py-1 rounded-md text-sm bg-(--primary) text-(--primary-foreground) hover:opacity-90"
          >
            Close
          </button>
        </div>

        {/* iframe area */}
        <div className="w-full h-[calc(100%-56px)]">
          {src ? (
            <iframe
              src={src}
              title={title}
              className="w-full h-full"
              frameBorder="0"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-(--muted-foreground)">
              Loading…
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------- SkeletonCard ---------- */
const SkeletonCard = () => (
  <div
    className="
      bg-(--card) rounded-(--radius) overflow-hidden border border-(--border)
      animate-fadeIn shadow-lg
    "
  >
    <div className="w-full h-44 bg-(--gradient)-to-r from-(--muted) via-(--accent) to-(--muted) animate-pulse" />
    <div className="p-4 space-y-2">
      <div className="h-4 w-3/4 bg-(--muted) rounded animate-pulse" />
      <div className="h-3 w-1/2 bg-(--muted) rounded animate-pulse" />
      <div className="h-8 w-24 bg-(--primary) rounded animate-pulse" />
    </div>
  </div>
);

/* ---------- PostCard ---------- */
const PostCard = ({ post, onOpen }) => {
  const dateText = post?.publish_date
    ? new Date(post.publish_date * 1000).toLocaleDateString()
    : "—";

  return (
    <article
      className="
        mb-6
        break-inside-avoid
        bg-(--card)
        text-(--card-foreground)
        rounded-(--radius)
        overflow-hidden
        shadow-lg
        border border-(--border)
        transition-transform duration-300
        hover:-translate-y-1 hover:shadow-2xl
      "
    >
      <div className="w-full h-48 overflow-hidden">
        <img
          src={post.thumbnail_url}
          alt={post.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold leading-tight">{post.title}</h3>
        {post.subtitle ? (
          <p className="text-sm text-(--muted-foreground) line-clamp-3">
            {post.subtitle}
          </p>
        ) : (
          <p className="text-sm text-(--muted-foreground) line-clamp-3">
            {post.preview_text || ""}
          </p>
        )}

        <div className="flex items-center justify-between text-sm text-(--muted-foreground)">
          <div className="flex items-center gap-3">
            <span className="font-medium">
              {post.authors?.[0] || "Unknown"}
            </span>
            <span className="text-xs px-2 py-1 rounded-md bg-(--muted) text-(--muted-foreground)">
              {post.audience || "free"}
            </span>
          </div>

          <div className="text-xs">{dateText}</div>
        </div>

        <div className="pt-2">
          <button
            onClick={() => onOpen(post.web_url, post.title)}
            className="inline-flex items-center gap-2 px-3 py-2 bg-(--primary) text-(--primary-foreground) rounded-(--radius) font-medium hover:opacity-95"
            aria-label={`Open ${post.title}`}
          >
            Read
          </button>
        </div>
      </div>
    </article>
  );
};

/* ---------- FeaturedSlider ---------- */

/* ---------- MasonryGrid ---------- */
/* Using columns for performance. Adjust column-count via responsive classes. */
const MasonryGrid = ({ posts, onOpen }) => {
  return (
    <div
      className="
        mx-auto
        px-4
        w-full
        max-w-6xl
        mt-8
        /* columns layout */
        columns-1 sm:columns-2 lg:columns-3
        gap-6
      "
    >
      {posts.map((p) => (
        <PostCard key={p.id} post={p} onOpen={onOpen} />
      ))}
    </div>
  );
};

/* ---------- Main Market Component ---------- */
const Market = () => {
  const [posts, setPosts] = useState(null); // null = loading; [] = empty
  const [modalOpen, setModalOpen] = useState(false);
  const [modalUrl, setModalUrl] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const openPreview = (url, title) => {
    setModalUrl(url);
    setModalTitle(title);
    setModalOpen(true);
  };
  const closePreview = () => setModalOpen(false);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("behive-fetch", {
        body: { name: "Functions" },
      });
      if (error) {
        console.error("Supabase function error:", error);
        setPosts([]);
        return;
      }
      // keep posts as an array, fallback to []
      setPosts(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error("Fetch error:", err);
      setPosts([]);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <main className="py-8 bg-(--background) min-h-screen">
      <TradingViewTicker />

      <section className="flex slider-section">
        <div className="max-w-6xl mx-auto px-4">
          {posts === null && (
            <>
              <div className="max-w-5xl mx-auto">
                <div className="space-y-4">
                  <div className="h-6 w-40 bg-(--muted) rounded animate-pulse" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
                    <SkeletonCard />
                  </div>
                </div>
              </div>
            </>
          )}
          {/* Content */}
          {posts !== null && posts.length > 0 && (
            <>
              {/* Featured slider: top 5 */}
              <FeaturedCarousel
                posts={posts.slice(0, 6)}
                onOpen={openPreview}
              />
            </>
          )}
          {/* Empty state */}
          {posts !== null && posts.length === 0 && (
            <div className="max-w-3xl mx-auto text-center py-20">
              <div className="text-(--muted-foreground)">No posts yet.</div>
            </div>
          )}
        </div>
        <div className="flex-col w-full">
          {/* <TradingViewMiniChart /> */}
          <TradingViewHotlist />
        </div>
      </section>
      <section className="flex items-center view-maps">
        <TradingViewHeatmap />
        <TradingViewCryptoHeatmap />
      </section>
      <div>
        <TradingViewTimeline />
      </div>
      <PostModal
        open={modalOpen}
        onClose={closePreview}
        url={modalUrl}
        title={modalTitle}
      />
    </main>
  );
};

export default Market;
