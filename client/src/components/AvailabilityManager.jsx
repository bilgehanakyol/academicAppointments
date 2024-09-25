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
  const [numberOfParts, setNumberOfParts] = useState(1); // Parça sayısını tutacak state

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

  const handleAddSlot = async () => {
    if (!selectedDay || !newSlot.start || !newSlot.end) return;
  
    const startDate = new Date(`${new Date().toISOString().split('T')[0]}T${newSlot.start}:00`);
    const endDate = new Date(`${new Date().toISOString().split('T')[0]}T${newSlot.end}:00`);
  
    setAvailability(prevAvailability => {
      const updatedAvailability = [...prevAvailability];
      const dayIndex = updatedAvailability.findIndex(day => day.day === selectedDay);
  
      if (dayIndex !== -1) {
        updatedAvailability[dayIndex].slots.push({ start: startDate, end: endDate });
      } else {
        updatedAvailability.push({ day: selectedDay, slots: [{ start: startDate, end: endDate }] });
      }
  
      return updatedAvailability;
    });
  
    try {
      await axios.post(`/availability/${user._id}`, {
        availability: { day: selectedDay, slots: [{ start: startDate, end: endDate }] }
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
  
      startDateTime.setHours(new Date(slot.start).getHours(), new Date(slot.start).getMinutes());
      endDateTime.setHours(new Date(slot.end).getHours(), new Date(slot.end).getMinutes());
  
      return {
        start: startDateTime,
        end: endDateTime,
        title: `${day.day}: ${new Date(slot.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(slot.end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        _id: slot._id
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
          value={newSlot.start}
          onChange={(e) => setNewSlot({ ...newSlot, start: e.target.value })}
          className="border rounded p-2 mr-2"
        />

        <input
          type="time"
          value={newSlot.end}
          onChange={(e) => setNewSlot({ ...newSlot, end: e.target.value })}
          className="border rounded p-2 mr-2"
        />

        <select
          value={numberOfParts}
          onChange={(e) => setNumberOfParts(Number(e.target.value))}
          className="border rounded p-2 mr-2"
        >
          <option value={1}>1 Parça</option>
          <option value={2}>2 Parça</option>
          <option value={3}>3 Parça</option>
          <option value={4}>4 Parça</option>
          <option value={5}>5 Parça</option>
        </select>

        <button onClick={handleAddSlot} className="bg-blue-500 text-white px-4 py-2 rounded">
          Ekle
        </button>
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Müsaitlik Takvimi</h3>
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{  margin: "50px 0" }}
          selectable
          onSelectEvent={handleDeleteSlot}
          views={['week']}
          defaultView="week"
          min={new Date(0, 0, 0, 7, 0, 0)} // Takvimdeki minimum saat
          max={new Date(0, 0, 0, 23, 0, 0)} // Takvimdeki maksimum saat
        />
      </div>
    </div>
  );
};

export default AvailabilityManager;
