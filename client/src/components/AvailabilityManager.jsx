import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import BackButton from './BackButton';

const localizer = momentLocalizer(moment);

const AvailabilityManager = () => {
  const { user, ready } = useContext(UserContext);
  const [availability, setAvailability] = useState([]);
  const [selectedDay, setSelectedDay] = useState('');
  const [newSlot, setNewSlot] = useState({ start: '', end: '' });
  const [numberOfParts, setNumberOfParts] = useState(1);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (user && ready) {
        try {
          const response = await axios.get(`/availability/${user._id}`);
          setAvailability(response.data || []);
        } catch (error) {
          console.error("Error fetching availability", error);
        }
      }
    };

    fetchAvailability();
  }, [user, ready]);

  // Zaman dilimlerini seçilen parça sayısına göre bölen fonksiyon
  const splitTimeSlots = (start, end, numberOfParts) => {
    const startHour = parseInt(start.split(':')[0], 10);
    const startMinute = parseInt(start.split(':')[1], 10);
    const endHour = parseInt(end.split(':')[0], 10);
    const endMinute = parseInt(end.split(':')[1], 10);

    const totalMinutes = (endHour * 60 + endMinute) - (startHour * 60 + startMinute);
    
    // Eğer toplam süre parçalanamazsa, null döndür ve uyarı ver
    if (totalMinutes % numberOfParts !== 0) {
      return null;
    }

    const partDuration = totalMinutes / numberOfParts;

    const slots = [];
    let currentStartHour = startHour;
    let currentStartMinute = startMinute;

    for (let i = 0; i < numberOfParts; i++) {
      const slotStart = `${currentStartHour.toString().padStart(2, '0')}:${currentStartMinute.toString().padStart(2, '0')}`;

      let currentEndHour = currentStartHour;
      let currentEndMinute = currentStartMinute + partDuration;

      if (currentEndMinute >= 60) {
        currentEndHour += Math.floor(currentEndMinute / 60);
        currentEndMinute = currentEndMinute % 60;
      }

      const slotEnd = `${currentEndHour.toString().padStart(2, '0')}:${currentEndMinute.toString().padStart(2, '0')}`;

      slots.push({ start: slotStart, end: slotEnd, isAvailable: true });

      currentStartHour = currentEndHour;
      currentStartMinute = currentEndMinute;
    }

    return slots;
  };

  const handleAddSlot = async () => {
    if (!selectedDay || !newSlot.start || !newSlot.end || numberOfParts < 1) return;

    // Seçilen aralığı belirlenen sayıda slot'a böl
    const slots = splitTimeSlots(newSlot.start, newSlot.end, numberOfParts);

    if (!slots) {
      alert('Girilen zaman aralığı tam sayı ile bölünemiyor. Lütfen başka bir süre veya parça sayısı seçin.');
      return;
    }

    setAvailability(prevAvailability => {
      const updatedAvailability = [...prevAvailability];
      const dayIndex = updatedAvailability.findIndex(day => day.day === selectedDay);

      if (dayIndex !== -1) {
        updatedAvailability[dayIndex].slots.push(...slots);
      } else {
        updatedAvailability.push({ day: selectedDay, slots });
      }

      return updatedAvailability;
    });

    // Backend'e slotları gönder
    try {
      await axios.post(`/availability/${user._id}`, {
        availability: { day: selectedDay, slots }
      });

      setNewSlot({ start: '', end: '' });
    } catch (error) {
      console.error("Error adding slot", error);
    }
  };

  const handleDeleteSlot = async (event) => {
    const { _id: slotId, start, end } = event;

    const confirmDelete = window.confirm(`Bu zaman aralığını silmek istediğinizden emin misiniz? \n${new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    
    if (!confirmDelete) return;

    try {
      await axios.delete(`/availability/${user._id}/${slotId}`);

      setAvailability(prevAvailability => {
        return prevAvailability.map(day => {
          return {
            ...day,
            slots: day.slots.filter(slot => slot._id !== slotId)
          };
        }).filter(day => day.slots.length > 0);
      });
    } catch (error) {
      console.error("Error deleting slot", error);
    }
  };

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  const getNextDateForDay = (dayName) => {
    const daysOfWeek = {
      'Monday': 1,
      'Tuesday': 2,
      'Wednesday': 3,
      'Thursday': 4,
      'Friday': 5,
      'Saturday': 6,
      'Sunday': 0
    };
    const today = new Date();
    const currentDay = today.getDay();
    const daysUntilNext = (daysOfWeek[dayName] + 7 - currentDay) % 7;
    const nextDate = new Date(today);
    nextDate.setDate(today.getDate() + daysUntilNext);
    return nextDate;
  };

  const events = availability?.flatMap(day =>
    day.slots.map(slot => {
      const nextDayDate = getNextDateForDay(day.day);
      const startDateTime = new Date(nextDayDate);
      const endDateTime = new Date(nextDayDate);

      const [startHour, startMinute] = slot.start.split(':');
      const [endHour, endMinute] = slot.end.split(':');

      startDateTime.setHours(startHour, startMinute);
      endDateTime.setHours(endHour, endMinute);

      return {
        start: startDateTime,
        end: endDateTime,
        title: `${day.day}: ${slot.start} - ${slot.end}`,
        _id: slot._id,
        isAvailable: slot.isAvailable
      };
    })
  ) || [];

  return (
    <div className="p-4">
      <BackButton />
      <h2 className="text-2xl font-semibold mb-4">Müsaitlik Yönetimi</h2>

      <div className="mb-4 flex items-center">
        <select onChange={handleDayChange} value={selectedDay} className="border rounded p-2 mr-2">
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
          placeholder="Başlangıç"
          value={newSlot.start}
          onChange={e => setNewSlot({ ...newSlot, start: e.target.value })}
          className="border rounded p-2 mr-2"
        />
        <input
          type="time"
          placeholder="Bitiş"
          value={newSlot.end}
          onChange={e => setNewSlot({ ...newSlot, end: e.target.value })}
          className="border rounded p-2 mr-2"
        />
        <input
          type="number"
          min="1"
          value={numberOfParts}
          onChange={e => setNumberOfParts(parseInt(e.target.value))}
          className="border rounded p-2 mr-2 w-16"
        />
        <button onClick={handleAddSlot} className="bg-blue-500 text-white p-2 rounded">Ekle</button>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectEvent={handleDeleteSlot}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={['week']}
        defaultView="week"
        min={new Date(0, 0, 0, 7, 0, 0)}
        max={new Date(0, 0, 0, 23, 0, 0)}
        step={15}
      />
    </div>
  );
};

export default AvailabilityManager;
