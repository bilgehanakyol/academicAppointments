import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Big Calendar stilini ekleyin

const localizer = momentLocalizer(moment); // moment.js'i kullanarak yerelleştirici oluşturun

const AvailabilityManager = () => {
  const { user, ready } = useContext(UserContext);
  const [availability, setAvailability] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [newSlot, setNewSlot] = useState({ start: '', end: '' });

  useEffect(() => {
    const fetchAvailability = async () => {
      if (user && ready) {
        try {
          const response = await axios.get(`/availability/${user._id}`);
          setAvailability(response.data);
        } catch (error) {
          console.error("Error fetching availability", error);
        }
      }
    };

    fetchAvailability();
  }, [user, ready]);

  const handleAddSlot = async () => {
    if (!selectedDay || !newSlot.start || !newSlot.end) return;

    const startDate = new Date(`${new Date().toISOString().split('T')[0]}T${newSlot.start}:00Z`);
    const endDate = new Date(`${new Date().toISOString().split('T')[0]}T${newSlot.end}:00Z`);

    try {
      const response = await axios.post(`/availability/${user._id}`, {
        availability: { day: selectedDay, slots: [{ start: startDate, end: endDate }] }
      });
      setAvailability(response.data.availability);
      setNewSlot({ start: '', end: '' });
    } catch (error) {
      console.error("Error adding slot", error);
    }
  };

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  // Müsaitlikleri Big Calendar için uygun formata dönüştür
  const events = availability.flatMap(day =>
    day.slots.map(slot => ({
      start: new Date(slot.start),
      end: new Date(slot.end),
      title: `${day.day}: ${new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    }))
  );

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Müsaitlik Yönetimi</h2>

      <div className="mb-4">
        <select onChange={handleDayChange} value={selectedDay}>
          <option value="">Gün Seç</option>
          <option value="Monday">Pazartesi</option>
          <option value="Tuesday">Salı</option>
          <option value="Wednesday">Çarşamba</option>
          <option value="Thursday">Perşembe</option>
          <option value="Friday">Cuma</option>
          <option value="Saturday">Cumartesi</option>
          <option value="Sunday">Pazar</option>
        </select>

        <input
          type="time"
          value={newSlot.start}
          onChange={(e) => setNewSlot({ ...newSlot, start: e.target.value })}
        />

        <input
          type="time"
          value={newSlot.end}
          onChange={(e) => setNewSlot({ ...newSlot, end: e.target.value })}
        />

        <button onClick={handleAddSlot} className="ml-2 bg-blue-500 text-white px-3 py-1">
          Ekle
        </button>
      </div>

      <h3 className="text-lg">Mevcut Müsaitlikler</h3>
      {availability.length > 0 ? (
        <ul>
          {availability.map((day) => (
            <li key={day.day} className="border-b py-2">
              <strong>{day.day}:</strong>
              <ul>
                {day.slots.map((slot, index) => (
                  <li key={index}>
                    {new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      ) : (
        <p>Müsaitlik bulunamadı.</p>
      )}

      <div className="mt-4">
        <h3 className="text-lg">Müsaitlik Takvimi</h3>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 500, margin: "50px" }}
        />
      </div>
    </div>
  );
};

export default AvailabilityManager;
