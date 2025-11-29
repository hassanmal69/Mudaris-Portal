import { useEffect, useRef } from "react";

export default function TradingViewTimeline() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Clear previous script if hot reloaded
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-timeline.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      displayMode: "regular",
      feedMode: "all_symbols",
      colorTheme: "dark",
      isTransparent: true,
      locale: "en",
      width: "100%",
      height: 557,
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      className="tradingview-widget-container"
      ref={containerRef}
      style={{ width: "100%", height: "100%" }}
    ></div>
  );
}
