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
  const { academianId } = useParams(); // URL'den akademisyen ID'sini al
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`/calendar/${academianId}`);
        const availability = response.data.availability;

        // Gün adını bir tarih ile eşleştir
        const dayOfWeekMap = {
          "Monday": 1,
          "Tuesday": 2,
          "Wednesday": 3,
          "Thursday": 4,
          "Friday": 5,
          "Saturday": 6,
          "Sunday": 0
        };

        // Gelen availability verisini React Big Calendar formatına dönüştürme
        const formattedEvents = availability.flatMap((dayData) =>
          dayData.slots.map((slot) => {
            const currentDay = dayOfWeekMap[dayData.day]; // Günün indexini al (0 = Sunday, 1 = Monday, vs.)

            // slot start ve end saatlerini alıp, ilgili güne ekle
            const startTime = new Date(slot.start);
            const endTime = new Date(slot.end);

            // startTime ve endTime'ı günün tarihine göre ayarla
            const start = moment().day(currentDay).set({
              hour: startTime.getUTCHours(),
              minute: startTime.getUTCMinutes(),
              second: 0,
              millisecond: 0,
            }).toDate();

            const end = moment().day(currentDay).set({
              hour: endTime.getUTCHours(),
              minute: endTime.getUTCMinutes(),
              second: 0,
              millisecond: 0,
            }).toDate();

            return {
              start,
              end,
              title: slot.isAvailable ? 'Available' : 'Unavailable', // Müsait mi değil mi
              isAvailable: slot.isAvailable // Slot durumu
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
    // Sadece dolu olan slotlara tıklanabilir, event üzerinden slot bilgisi alınıyor
    if (!event.isAvailable) return; // Eğer slot boşsa işlem yapma

    const selectedDay = event.start.toISOString().split('T')[0]; // Tarihi al
    const startTime = event.start.toISOString().split('T')[1].slice(0, 5); // Başlangıç saatini al
    const endTime = event.end.toISOString().split('T')[1].slice(0, 5); // Bitiş saatini al

    // Yönlendirme için URL oluşturuyoruz
    const url = `/create-appointment?day=${selectedDay}&slot=${startTime}-${endTime}&academianId=${academianId}`;

    // Kullanıcıyı yönlendir
    navigate(url);
  };

  return (
    <div className='p-4'>
      <BackButton />
      <div className="p-4">
        <h2 className="text-2xl font-semibold mb-4">Randevu Talep Et</h2>
        <Calendar
          localizer={localizer}
          events={events} // Veritabanından gelen dolu slotlar
          selectable={false} // Boş slotlar seçilemez
          onSelectEvent={handleSelectEvent} // Sadece dolu slotlara tıklanabilir
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500 }}
          views={['week']}
          defaultView="week"
          min={new Date(0, 0, 0, 7, 0, 0)} // Takvimdeki minimum saat
          max={new Date(0, 0, 0, 23, 0, 0)} // Takvimdeki maksimum saat
        />
      </div>
    </div>
  );
};

export default CalendarView;
