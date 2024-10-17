import React from 'react';
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";

const localizer = momentLocalizer(moment);

const CalendarComponent = ({ events, onSelectEvent, min, max }) => {
  return (
    <BigCalendar
      localizer={localizer}
      events={events}
      selectable
      onSelectEvent={onSelectEvent}
      startAccessor="start"
      endAccessor="end"
      style={{ height: 800 }}
      views={['week']}
      defaultView="week"
      min={min}
      max={max}
      step={15}
      timeslots={4}
      timeFormat="HH:mm"
      formats={{
        timeGutterFormat: 'HH:mm',
        eventTimeRangeFormat: ({ start, end }) =>
          `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
      }}
    />
  );
};

export default CalendarComponent;
