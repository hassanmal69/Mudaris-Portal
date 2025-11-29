import { useEffect, useRef } from "react";

export default function TradingViewCryptoHeatmap() {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js";
    script.async = true;

    script.innerHTML = JSON.stringify({
      dataSource: "Crypto",
      blockSize: "market_cap_calc",
      blockColor: "24h_close_change|5",
      locale: "en",
      symbolUrl: "",
      colorTheme: "dark",
      hasTopBar: true,
      isDataSetEnabled: true,
      isZoomEnabled: true,
      hasSymbolTooltip: true,
      isMonoSize: false,
      width: "100%", // made responsive
      height: 525,
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div ref={containerRef} className="w-full max-w-[409px] mx-auto my-6" />
  );
}
