import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../components/UserContext';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import BackButton from '../components/BackButton';
import Button from '../components/Button';

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
          const response = await axios.get(`/academians/availability/${user._id}`);
          setAvailability(response.data || []);
        } catch (error) {
          console.error("Error fetching availability", error);
        }
      }
    };
    fetchAvailability();
  }, [user, ready]);

  const splitTimeSlots = (start, end, numberOfParts) => {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    
    const startTotalMinutes = startHour * 60 + startMinute;
    const endTotalMinutes = endHour * 60 + endMinute;
    const totalMinutes = endTotalMinutes - startTotalMinutes;

    if (totalMinutes <= 0 || numberOfParts < 1) {
        return null; // Geçersiz zaman aralığı
    }

    const partDuration = totalMinutes / numberOfParts; // Her slot için süre
    const slots = [];
    for (let i = 0; i < numberOfParts; i++) {
        const slotStartTotalMinutes = startTotalMinutes + partDuration * i;
        const slotEndTotalMinutes = startTotalMinutes + partDuration * (i + 1);

        const slotStartHour = Math.floor(slotStartTotalMinutes / 60);
        const slotStartMinute = slotStartTotalMinutes % 60;
        const slotEndHour = Math.floor(slotEndTotalMinutes / 60);
        const slotEndMinute = slotEndTotalMinutes % 60;

        const slotStart = `${slotStartHour.toString().padStart(2, '0')}:${slotStartMinute.toString().padStart(2, '0')}`;
        const slotEnd = `${slotEndHour.toString().padStart(2, '0')}:${slotEndMinute.toString().padStart(2, '0')}`;

        slots.push({ start: slotStart, end: slotEnd, isAvailable: true });
    }
    return slots;
};


  const handleAddSlot = async () => {
    if (!selectedDay || !newSlot.start || !newSlot.end || numberOfParts < 1) return;

    const slots = splitTimeSlots(newSlot.start, newSlot.end, numberOfParts);

    if (!slots) {
        alert('Slot not found, Please check.');
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

    try {
      await axios.post(`/academians/availability/${user._id}`, {
        availability: { day: selectedDay, slots }
      });
      setNewSlot({ start: '', end: '' });
    } catch (error) {
      console.error("Error adding slot", error);
    }
  };

  const handleDeleteSlot = async (event) => {
    const { _id: slotId, start, end } = event;

    if (!window.confirm(`Are you sure you want to delete this time slot? \n${new Date(start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${new Date(end).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`)) return;

    try {
      await axios.delete(`/academians/availability/${user._id}/${slotId}`);
      setAvailability(prevAvailability => prevAvailability.map(day => ({
        ...day,
        slots: day.slots.filter(slot => slot._id !== slotId)
      })).filter(day => day.slots.length > 0));
    } catch (error) {
      console.error("Error deleting slot", error);
    }
  };

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  const getNextDateForDay = (dayName) => {
    const daysOfWeek = { 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3, 'Thursday': 4, 'Friday': 5, 'Saturday': 6, 'Sunday': 0 };
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
      const [startHour, startMinute] = slot.start.split(':').map(Number);
      const [endHour, endMinute] = slot.end.split(':').map(Number);
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
      <h2 className="text-2xl font-semibold mb-4">Availability Manager</h2>

      <div className="mb-4 flex items-center">
        <select onChange={handleDayChange} value={selectedDay} className="border rounded p-2 mr-2">
          <option value="">Choose a day</option>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
        <input
          type="time"
          value={newSlot.start}
          onChange={e => setNewSlot({ ...newSlot, start: e.target.value })}
          className="border rounded p-2 mr-2"
        />
        <input
          type="time"
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
        <Button onClick={handleAddSlot} className="w-16">
          Add
        </Button>
      </div>

      <Calendar
        localizer={localizer}
        events={events}
        selectable
        onSelectEvent={handleDeleteSlot}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 800 }}
        views={['week']}
        defaultView="week"
        min={new Date(0, 0, 0, 7, 0, 0)}
        max={new Date(0, 0, 0, 23, 0, 0)}
        step={15}
        timeslots={4}
        timeFormat="HH:mm"
        formats={{
          timeGutterFormat: 'HH:mm',
          eventTimeRangeFormat: ({ start, end }) => `${moment(start).format('HH:mm')} - ${moment(end).format('HH:mm')}`,
        }}
      />
    </div>
  );
};

export default AvailabilityManager;