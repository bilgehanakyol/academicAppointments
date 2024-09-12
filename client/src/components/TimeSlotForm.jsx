import React, { useState, useContext } from 'react';
import { addAvailability } from '../availability';  // Fonksiyonu içe aktarın
import { UserContext } from './UserContext';  // Kullanıcı bilgilerini almak için

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

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
  const { user } = useContext(UserContext);  // Kullanıcı bilgilerini al

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedDay && startTime && endTime && interval > 0 && user) {
      const slots = timeSlots(startTime, endTime, interval);

      try {
        await addAvailability(selectedDay, slots, user._id);  // Academian ID'sini de gönder
        alert('Müsaitlik başarıyla eklendi!');
        setSelectedDay('');
        setStartTime('');
        setEndTime('');
        setInterval(15);
        onAddAvailability(selectedDay, slots); // Callback
      } catch (error) {
        console.error('Müsaitlik eklenirken bir hata oluştu:', error);
        alert('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-gray-700">Gün:</label>
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="w-full mt-2 p-2 border rounded-lg"
          required
        >
          <option value="">Bir gün seçin</option>
          {daysOfWeek.map((day, index) => (
            <option key={index} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Başlangıç Saati:</label>
        <input
          type="time"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full mt-2 p-2 border rounded-lg"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Bitiş Saati:</label>
        <input
          type="time"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full mt-2 p-2 border rounded-lg"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Dilim Süresi (Dakika):</label>
        <input
          type="number"
          value={interval}
          onChange={(e) => setInterval(Number(e.target.value))}
          className="w-full mt-2 p-2 border rounded-lg"
          required
          min="5"
          step="5"
          placeholder="Dilim süresi girin (örn. 15)"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
      >
        Müsaitlik Ekle
      </button>
    </form>
  );
}
