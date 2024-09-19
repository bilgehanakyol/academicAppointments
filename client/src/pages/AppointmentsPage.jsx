import React, { useState } from 'react';
import BackButton from '../components/BackButton';
import TimeSlotForm from '../components/TimeSlotForm';
import AvailabilityTable from '../components/AvailabilityTable';

export default function AppointmentsPage() {
  const [availabilities, setAvailabilities] = useState({});

  // Günlere göre müsaitlik ekleme işlevi
  const addAvailability = (day, timeSlots) => {
    setAvailabilities((prevAvailabilities) => ({
      ...prevAvailabilities,
      [day]: [...(prevAvailabilities[day] || []), ...timeSlots],
    }));
  };

  return (
    <div className="p-4">
      <BackButton />
      <div className="p-6 bg-gray-100 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Weekly Program</h1>
        <TimeSlotForm onAddAvailability={addAvailability} />
        <AvailabilityTable availabilities={availabilities} />
      </div>
    </div>
  );
}
