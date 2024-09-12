import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function StudentViewCalendar({ academianId }) {
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    async function fetchCalendar() {
      try {
        const { data } = await axios.get(`/calendar/${academianId}`);
        setAvailability(data.availability);
      } catch (error) {
        console.error('Error fetching calendar', error);
      }
    }
    fetchCalendar();
  }, [academianId]);

  return (
    <WeeklyCalendar
      appointments={availability}
      onAvailabilityChange={null} // Öğrencinin değiştirme hakkı yok
    />
  );
}
