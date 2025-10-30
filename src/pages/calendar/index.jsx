import React from 'react'

const Calendar = () => {
    return (
        <div>
            <iframe src="https://sslecal2.investing.com?ecoDayBackground=%23ffffff&innerBorderColor=%235700d9&borderColor=%238500c7&columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&features=datepicker,timezone,timeselector&countries=6,37,72,22,17,35,4,5&calType=week&timeZone=8&lang=1"
                width="650"
                height="467"
                loading="lazy"
                frameborder="0"
                allowtransparency="true"
                marginwidth="0"
                marginheight="0"></iframe>
        </div>
    )
}

export default Calendar