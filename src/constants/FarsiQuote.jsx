import quotesData from "@/assets/qoutes/Qoutes.json";
import { useEffect, useState } from "react";
export const FarsiQuote = () => {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    if (quotesData && quotesData.length > 0) {
      const randomIndex = Math.floor(Math.random() * quotesData.length);
      setQuote(quotesData[randomIndex]);
    }
  }, []);

  if (!quote) return null;

  return (
    <div
      className="flex flex-col items-center justify-center h-full w-full px-6 animate-fadeIn"
      style={{ minHeight: "300px" }}
    >
      <blockquote
        className="text-3xl md:text-4xl
        Entezar
      
      lg:text-5xl font-semibold italic text-white text-center leading-relaxed font-serif"
      >
        {`«${quote.quote}»`}
      </blockquote>
      <span className="mt-4 text-lg text-muted">— {quote.author}</span>
    </div>
  );
};
