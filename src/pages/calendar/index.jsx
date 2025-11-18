import { CalendarIcon } from 'lucide-react'
import React from 'react'

const Calendar = () => {
    return (
        <div className='p-4 flex flex-col gap-6'>
            <div className="flex flex-col gap-0 items-center">
                <span className="bg-(--primary) text-(--foreground) w-[65px] rounded-md h-[65px] flex items-center justify-center mb-2">
                    <CalendarIcon className="w-9 h-9" />
                </span>
                <h2 className="text-2xl text-(--foreground)">
                    Economic Calendar
                </h2>
                <p className="text-(--muted-foreground)">
                    Stay updated with important economic events and market-moving news.
                </p>
            </div>
            <div className="w-full bg-(--background) p-4">
                <iframe src="https://sslecal2.investing.com?ecoDayBackground=%23ffffff&innerBorderColor=%235700d9&borderColor=%238500c7&columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&features=datepicker,timezone,timeselector&countries=6,37,72,22,17,35,4,5&calType=week&timeZone=8&lang=1"
                    width="100%"
                    height="467"
                    loading="lazy"
                    frameborder="0"
                    allowtransparency="true"
                    marginwidth="0"
                    marginheight="0"></iframe>
            </div>
        </div>
    )
}

export default Calendar