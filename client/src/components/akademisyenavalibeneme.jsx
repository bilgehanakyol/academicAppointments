import React, { useState } from 'react';
import TimeSlotForm from './TimeSlotForm'; // Doğru yolu belirttiğinizden emin olun
import AvailabilityTable from './AvailabilityTable'; // Doğru yolu belirttiğinizden emin olun

export default function WeeklyAvailability() {
  const [availabilities, setAvailabilities] = useState({});

  const addAvailability = (day, timeSlots) => {
    setAvailabilities((prevAvailabilities) => ({
      ...prevAvailabilities,
      [day]: [...(prevAvailabilities[day] || []), ...timeSlots],
    }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Haftalık Müsaitlik Belirleme</h1>

      {/* Müsaitlik ekleme formu */}
      <TimeSlotForm onAddAvailability={addAvailability} />

      {/* Haftalık Müsaitlik Tablosu */}
      <AvailabilityTable availabilities={availabilities} />
    </div>
  );
}
