import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from './BackButton';

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const { user } = useContext(UserContext);
  const { academianId } = useParams();
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // Veritabanındaki randevuların alınması
        const appointmentsResponse = await axios.get(`/appointments/${academianId}`);
        const appointments = appointmentsResponse.data;


        //hata buradan calendar ava!!!!!! TODO
        // Akademisyenin müsaitlik bilgilerinin alınması
        const availabilityResponse = await axios.get(`/calendar/${academianId}`);
        const availability = availabilityResponse.data.availability;

        const dayOfWeekMap = {
          "Monday": 1,
          "Tuesday": 2,
          "Wednesday": 3,
          "Thursday": 4,
          "Friday": 5,
          "Saturday": 6,
          "Sunday": 0
        };

        const formattedEvents = availability.flatMap((dayData) =>
          dayData.slots.map((slot) => {
            const currentDay = dayOfWeekMap[dayData.day];

            // Yeni format: start ve end string formatında
            const [startHour, startMinute] = slot.start.split(':');
            const [endHour, endMinute] = slot.end.split(':');

            const start = moment().day(currentDay).set({
              hour: parseInt(startHour, 10),
              minute: parseInt(startMinute, 10),
              second: 0,
              millisecond: 0,
            }).toDate();

            const end = moment().day(currentDay).set({
              hour: parseInt(endHour, 10),
              minute: parseInt(endMinute, 10),
              second: 0,
              millisecond: 0,
            }).toDate();

            // Randevu kontrolü: mevcut slot bir randevu tarafından kaplı mı?
            const isAvailable = !appointments.some(appointment => {
              const appointmentStart = new Date(appointment.start);
              const appointmentEnd = new Date(appointment.end);
              return (appointmentStart < end && appointmentEnd > start);
            });

            return {
              start,
              end,
              title: isAvailable ? 'Available' : 'Unavailable',
              isAvailable
            };
          })
        );

        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching calendar', error);
      }
    };

    fetchEvents();
  }, [academianId]);

  const handleSelectEvent = (event) => {
    if (!event.isAvailable) return;

    const selectedDay = event.start.toISOString().split('T')[0];
    const startTime = event.start.toISOString().split('T')[1].slice(0, 5);
    const endTime = event.end.toISOString().split('T')[1].slice(0, 5);

    const url = `/create-appointment?day=${selectedDay}&slot=${startTime}-${endTime}&academianId=${academianId}`;
    navigate(url);
  };

  return (
    <div className='p-4'>
      <BackButton />
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Randevu Talep Et</h2>
        <Calendar
          localizer={localizer}
          events={events}
          selectable={false}
          onSelectEvent={handleSelectEvent}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          views={['week']}
          defaultView="week"
          min={new Date(0, 0, 0, 7, 0, 0)}
          max={new Date(0, 0, 0, 23, 0, 0)}
        />
      </div>
    </div>
  );
};

export default CalendarView;