import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../components/UserContext';
import CalendarComponent from '../components/Calendar';
import { useNavigate, useParams } from 'react-router-dom';
import BackButton from '../components/BackButton';
import moment from 'moment';
import { momentLocalizer } from 'react-big-calendar'; // momentLocalizer'ı buraya ekledik

const localizer = momentLocalizer(moment);

const CalendarView = () => {
  const { user } = useContext(UserContext);
  const { academianId } = useParams();
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const availabilityResponse = await axios.get(`/academians/calendar/${academianId}`);
        const availability = availabilityResponse.data.availability;

        const appointmentsResponse = await axios.get(`/academians/availability/${academianId}`);
        const appointments = appointmentsResponse.data;

        const dayOfWeekMap = {"Monday": 1,"Tuesday": 2,"Wednesday": 3,"Thursday": 4,"Friday": 5,"Saturday": 6,"Sunday": 0};

        const formattedEvents = availability.flatMap((dayData) =>
          dayData.slots.map((slot) => {
            const currentDay = dayOfWeekMap[dayData.day];

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

            const isAvailable = !appointments.some(appointment => {
              const appointmentStart = new Date(appointment.start);
              const appointmentEnd = new Date(appointment.end);
              return (appointmentStart < end && appointmentEnd > start);
            });

            return {
              id: slot._id,
              start,
              end,
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

    const selectedDay = moment(event.start).format('YYYY-MM-DD');
    const startTime = moment(event.start).format('HH:mm');
    const endTime = moment(event.end).format('HH:mm');

    const url = `/create-appointment?day=${selectedDay}&slot=${startTime}-${endTime}&academianId=${academianId}&slotId=${event.id}`;
    navigate(url);
  };
  return (
    <div className='p-4'>
      <BackButton />
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Appointment Request</h2>
        <CalendarComponent
        events={events}
        onSelectEvent={handleSelectEvent}
        min={new Date(0, 0, 0, 7, 0, 0)}
        max={new Date(0, 0, 0, 23, 0, 0)}
      />
      </div>
    </div>
  );
};

export default CalendarView;