import React, { useEffect, useState } from "react";
import { supabase } from "@/services/supabaseClient.js";
import { Link as MoizChain, ExternalLink } from "lucide-react";

const LecturesLink = () => {
  const [lectures, setLectures] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLectures = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("lectures")
        .select("*")
        .order("lecture_date", { ascending: false });

      if (error) {
        console.error("Error fetching lectures:", error);
      } else {
        setLectures(data);
      }
      setLoading(false);
    };

    fetchLectures();
  }, []);

  // Deterministic color palette for tag badges (darker variants for dark theme)
  const tagColors = [
    "bg-red-500/20 text-red-500/90 border-red-500/90 border",
    "bg-yellow-400/20 text-yellow-400/90 border-yellow-400/90 border",
    "bg-green-400/20 text-green-400/90 border-green-400/90 border",
    "bg-blue-400/20 text-blue-400/90 border-blue-400/90 border",
    "bg-indigo-400/20 text-indigo-400/90 border-indigo-400/90 border",
    "bg-purple-400/20 text-purple-400/90 border-purple-400/90 border",
    "bg-pink-400/20 text-pink-400/90 border-pink-400/90 border",
    "bg-amber-400/20 text-amber-400/90 border-amber-400/90 border",
    "bg-teal-400/20 text-teal-400/90 border-teal-400/90 border",
  ];

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

  return (
    <section className="max-w-4xl mx-auto p-4 space-y-4">
      <div className="flex flex-col gap-0 items-center">
        <span className="bg-(--primary) text-(--foreground) w-[65px] rounded-md h-[65px] flex items-center justify-center mb-2">
          <MoizChain className="w-9 h-9" />
        </span>

        <h2 className="text-2xl text-(--foreground)">Lecture Links</h2>
        <p className="text-(--muted-foreground)">
          Access all live sessions, webinars, and recorded lectures
        </p>
      </div>
      {loading ? (
        <p className="text-center text-muted-foreground">Loading lectures...</p>
      ) : (
        <div className="space-y-4">
          {lectures.map((lecture, id) => {
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
    </section>
  );
};

export default LecturesLink;
