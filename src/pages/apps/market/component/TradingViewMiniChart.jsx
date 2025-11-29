import { useEffect, useRef } from "react";

export default function TradingViewMiniChart() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Clear previous script on rerender
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbol: "BITSTAMP:BTCUSD",
      chartOnly: false,
      dateRange: "12M",
      noTimeScale: false,
      colorTheme: "dark",
      isTransparent: true,
      locale: "en",
      width: "100%",
      autosize: true,
      height: "100%",
    });

    containerRef.current.appendChild(script);
  }, []);

  return <div ref={containerRef} className="w-full h-[400px] my-6" />;
}
