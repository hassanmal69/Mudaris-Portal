import React from "react";
import { CalendarIcon } from "lucide-react";
import "./calendar.css";
const Calendar = () => {
  return (
    <div className="p-4 calender-section  flex bg-(--background) h-full flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-0 items-center">
        <span className="bg-(--primary) dark:text-(--primary-foreground) text-(--foreground) w-[65px] h-[65px] rounded-md flex items-center justify-center mb-2">
          <CalendarIcon className="w-9 h-9" />
        </span>

        <h2 className="text-2xl text-(--foreground)">Economic Calendar</h2>
        <p className="text-(--secondary-foreground) text-sm">
          Stay updated with important economic events and market-moving news.
        </p>
      </div>

      {/* Calendar Embed */}
      <div className="w-full widget-wrapper p-4 flex flex-col items-center justify-center">
        <iframe
          src="https://sslecal2.investing.com?ecoDayBackground=%230f1d3d&defaultFont=%23000000&ecoDayFontColor=%23000000&columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&features=datepicker,timezone,timeselector,filters&countries=25,6,37,22,17,35,4,5&calType=week&timeZone=8&lang=1"
          className="widget-styles"
          frameborder="0"
          allowtransparency="true"
          marginwidth="0"
          marginheight="0"
        ></iframe>
      </div>
    </div>
  );
};

export default Calendar;
