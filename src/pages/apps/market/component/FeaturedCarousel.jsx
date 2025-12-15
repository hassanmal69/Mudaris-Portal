import React, { useEffect, useRef, useState } from "react";

/* ---------- FeaturedSlider (Carousel) ---------- */
const FeaturedSlider = ({ posts = [], onOpen }) => {
  const ref = useRef(null);
  const scroll = (dir = "next") => {
    const el = ref.current;
    if (!el) return;

    const firstCard = el.querySelector("[data-card]");
    if (!firstCard) return;

    const cardWidth =
      firstCard.offsetWidth + parseInt(getComputedStyle(el).columnGap || 16);

    el.scrollBy({
      left: dir === "next" ? cardWidth : -cardWidth,
      behavior: "smooth",
    });
  };

  // const scroll = (dir = "next") => {
  //   const el = ref.current;
  //   if (!el) return;

  //   // Width of one child = carousel width / visible cards
  //   const cardWidth = el.clientWidth / 3; // show 3 cards
  //   const offset = dir === "next" ? cardWidth : -cardWidth;

  //   el.scrollBy({ left: offset, behavior: "smooth" });
  // };

  if (!posts.length) return null;

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between mb-3 px-2">
        <h2 className="text-xl font-semibold text-(--foreground)">
          Featured Posts
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => scroll("prev")}
            className="px-3 py-1 bg-(--primary) text-(--primary-foreground) rounded"
          >
            ‹
          </button>
          <button
            onClick={() => scroll("next")}
            className="px-3 py-1 bg-(--primary) text-(--primary-foreground) rounded"
          >
            ›
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={ref}
        className="
          flex gap-4 overflow-x-auto scroll-smooth no-scrollbar
          snap-x snap-mandatory px-2 scroll-px-2
        "
      >
        {posts.map((p, idx) => (
          <div
            key={p.id || idx}
            data-card
            className="
              snap-start
              shrink-0
              w-[90%]
              sm:w-[50%]
              lg:w-[33%]
              max-w-[380px]
            "
          >
            <div className="rounded-lg h-[350px] overflow-hidden shadow-lg border border-(--border) bg-(--card)">
              <div className="h-44 overflow-hidden">
                <img
                  src={p.thumbnail_url}
                  alt={p.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-4 flex flex-col justify-between">
                <h4 className="text-lg font-semibold line-clamp-2 text-(--primary-foreground)">
                  {p.title}
                </h4>

                <p className="text-sm text-(--muted-foreground) line-clamp-2 mt-1">
                  {p.subtitle || p.preview_text}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs text-(--muted-foreground)">
                    {p.authors?.[0] || "Unknown"}
                  </span>

                  <button
                    onClick={() => onOpen(p.web_url, p.title)}
                    className="text-xs px-2 py-1 bg-(--primary) text-(--primary-foreground) rounded"
                  >
                    Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(FeaturedSlider);
