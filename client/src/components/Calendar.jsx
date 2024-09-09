import React, { useState, useEffect } from 'react';

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const timeSlots = Array.from({ length: 9 }, (_, i) => `${9 + i}:00 - ${10 + i}:00`); // 09:00 - 18:00 saat aralıkları

export default function WeeklyCalendar({ appointments, onAvailabilityChange }) {
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    if (appointments) {
      setAvailability(appointments); // Mevcut randevuları yükle
    }
  }, [appointments]);

  const handleSlotClick = (day, time) => {
    const updatedAvailability = { ...availability };
    if (!updatedAvailability[day]) {
      updatedAvailability[day] = [];
    }
    if (updatedAvailability[day].includes(time)) {
      updatedAvailability[day] = updatedAvailability[day].filter(slot => slot !== time);
    } else {
      updatedAvailability[day].push(time);
    }
    setAvailability(updatedAvailability);
    onAvailabilityChange(updatedAvailability); // Değişiklikleri dışarıya gönder
  };

  return (
    <div className="grid grid-cols-8 gap-2">
      {/* Boş alan (sol üst köşe) */}
      <div></div> 

      {/* Günlerin başlıkları */}
      {daysOfWeek.map(day => (
        <div key={day} className="text-center font-bold">{day}</div>
      ))}

      {/* Saatlerin listesi ve hücreler */}
      {timeSlots.map(time => (
        <React.Fragment key={time}>
          {/* Saat dilimi sol sütunda */}
          <div className="font-bold">{time}</div>
          {/* Her saat dilimi için günlerdeki hücreler */}
          {daysOfWeek.map(day => (
            <div
              key={day + time}
              className={`border p-2 cursor-pointer text-center 
              ${availability[day]?.includes(time) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              onClick={() => handleSlotClick(day, time)}
            >
              {availability[day]?.includes(time) ? 'Busy' : 'Available'}
            </div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
