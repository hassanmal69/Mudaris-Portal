import { useState, useEffect } from "react";

/**
 * Custom hook to detect if a given media query matches.
 * @param {string} query - The media query string (e.g., "(max-width: 768px)")
 * @returns {boolean} - True if the media query matches, false otherwise.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQueryList = window.matchMedia(query);

    // Initial match
    setMatches(mediaQueryList.matches);

    // Listener for changes
    const listener = (event) => setMatches(event.matches);
    mediaQueryList.addEventListener("change", listener);

    return () => {
      mediaQueryList.removeEventListener("change", listener);
    };
  }, [query]);

  return matches;
}
