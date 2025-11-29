import { useEffect, useRef } from "react";

export default function TradingViewHotlist() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js";
    script.async = true;

    script.innerHTML = JSON.stringify({
      exchange: "US",
      colorTheme: "dark",
      dateRange: "12M",
      showChart: true,
      locale: "en",
      largeChartUrl: "",
      isTransparent: true,
      showSymbolLogo: true,
      showFloatingTooltip: false,
      plotLineColorGrowing: "rgba(56, 142, 60, 1)",
      plotLineColorFalling: "rgba(178, 40, 51, 1)",
      gridLineColor: "rgba(240, 243, 250, 0)",
      scaleFontColor: "#DBDBDB",
      belowLineFillColorGrowing: "rgba(27, 94, 32, 0.12)",
      belowLineFillColorFalling: "rgba(128, 25, 34, 0.12)",
      belowLineFillColorGrowingBottom: "rgba(27, 94, 32, 0)",
      belowLineFillColorFallingBottom: "rgba(128, 25, 34, 0)",
      symbolActiveColor: "rgba(41, 98, 255, 0.12)",
      width: "100%", // Responsive width
      height: "550",
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-[400px] mx-auto my-6" />
  );
}
