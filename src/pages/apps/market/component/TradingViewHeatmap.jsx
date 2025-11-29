import { useEffect, useRef } from "react";

export default function TradingViewHeatmap() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js";
    script.async = true;

    script.innerHTML = JSON.stringify({
      dataSource: "SPX500",
      blockSize: "market_cap_basic",
      blockColor: "change",
      grouping: "sector",
      locale: "en",
      symbolUrl: "",
      colorTheme: "dark",
      exchanges: [],
      hasTopBar: true,
      isDataSetEnabled: false,
      isZoomEnabled: true,
      hasSymbolTooltip: true,
      isMonoSize: false,
      width: "100%", // Responsive
      height: 525,
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-[860px] mx-auto my-8" />
  );
}
