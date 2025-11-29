import { useEffect, useRef } from "react";

export default function TradingViewTicker() {
  const containerRef = useRef(null);

  useEffect(() => {
    // Clear old script if React rerenders
    if (containerRef.current) {
      containerRef.current.innerHTML = "";
    }

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "FOREXCOM:SPXUSD", title: "S&P 500 Index" },
        { proName: "OANDA:XAUUSD", title: "Gold" },
        { proName: "COINBASE:BTCUSD", title: "Bitcoin" },
        { proName: "NASDAQ:TSLA", title: "Tesla" },
        { proName: "NASDAQ:NVDA", title: "Nvidia" },
        { proName: "NASDAQ:META", title: "Meta" },
        { proName: "NASDAQ:AMZN", title: "Amazon" },
        { proName: "NASDAQ:AAPL", title: "Apple" },
        { proName: "NASDAQ:MSFT", title: "Microsoft" },
        { proName: "NASDAQ:NFLX", title: "Netflix" },
        { proName: "NASDAQ:GOOGL", title: "Google" },
      ],
      colorTheme: "dark",
      isTransparent: true,
      displayMode: "compact",
      locale: "en",
    });

    containerRef.current.appendChild(script);
  }, []);

  return (
    <div
      ref={containerRef}
      className="w-full mb-6"
      style={{ height: "48px" }}
    />
  );
}
