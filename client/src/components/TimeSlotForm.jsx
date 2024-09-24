import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

// Zaman dilimleri hesaplama fonksiyonu
const timeSlots = (startTime, endTime, interval) => {
  const slots = [];
  let currentTime = new Date(`1970-01-01T${startTime}:00`);
  const endTimeDate = new Date(`1970-01-01T${endTime}:00`);

  while (currentTime < endTimeDate) {
    slots.push({
      date: currentTime.toTimeString().substring(0, 5),
      isAvailable: true
    });
    currentTime = new Date(currentTime.getTime() + interval * 60000);
  }
  return slots;
};

export default function TimeSlotForm({ onAddAvailability }) {
  const [selectedDay, setSelectedDay] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [interval, setInterval] = useState(15);
  const { user } = useContext(UserContext);

  // Yeni zaman dilimlerini ekleme
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedDay && startTime && endTime && interval > 0 && user) {
      const slots = timeSlots(startTime, endTime, interval);

      try {
        // Randevu oluşturmak için API çağrısı
        const appointmentPromises = slots.map(slot => {
          return axios.post(`/appointments/${user._id}/add-slots`, {
            //studentId: user._id, // Öğrenci kimliği
            academianId: user.academianId, // Akademisyenin kimliği (gerekirse UserContext'ten al)
            date: selectedDay,
            startTime: slot.date,
            endTime: slot.date // Burada startTime ve endTime kullanılması gerekebilir
          });
        });

        await Promise.all(appointmentPromises);

        alert('Availability added successfully!');
        setSelectedDay('');
        setStartTime('');
        setEndTime('');
        setInterval(15);
        onAddAvailability(selectedDay, slots); // Callback
      } catch (error) {
        console.error('Error occurred while adding availability:', error);
        alert('An error occurred. Please try again.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mx-auto mb-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-700">Add New Time Slots</h3>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Day:</label>
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
          required
        >
          <option value="">Select a day</option>
          {daysOfWeek.map((day, index) => (
            <option key={index} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-4 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium">Start time:</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 font-medium">End time:</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
            required
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Interval (minutes):</label>
        <input
          type="number"
          value={interval}
          onChange={(e) => setInterval(Number(e.target.value))}
          min="1"
          className="w-full mt-2 p-2 border border-gray-300 rounded-lg focus:ring focus:ring-blue-200 focus:border-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-200"
      >
        Add Availability
      </button>
    </form>
  );
}
