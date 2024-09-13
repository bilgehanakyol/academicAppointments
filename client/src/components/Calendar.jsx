import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

export default function CalendarPage() {
  const { id } = useParams();
  const [availabilities, setAvailabilities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        const { data } = await axios.get(`/availability?userId=${id}`);
        const availabilityData = {};
        data.forEach(day => {
          availabilityData[day.day] = day.slots.map(slot => slot.date).filter(date => date); // Sadece geçerli tarihleri ekleyin
        });
        setAvailabilities(availabilityData);
      } catch (error) {
        console.error('An error occurred while retrieving time slots:', error);
      }
    };

    fetchAvailabilities();
  }, [id]);

  const handleSlotClick = (day, slot) => {
    // Randevu oluşturma sayfasına yönlendirme
    navigate(`/create-appointment?day=${day}&slot=${slot}&academianId=${id}`);
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Added time slots.</h2>
      {Object.keys(availabilities).length > 0 ? (
        <div className="grid grid-cols-8 gap-4">
          {daysOfWeek.map((day) => (
            <div key={day} className="border p-2 bg-gray-100">
              <h3 className="font-semibold text-center mb-2">{day}</h3>
              {availabilities[day] && availabilities[day].length > 0 ? (
                <div className="grid grid-cols-1 gap-2">
                  {availabilities[day].map((slot, index) => (
                    <div 
                      key={index} 
                      className="border p-2 bg-white rounded shadow cursor-pointer hover:bg-blue-100"
                      onClick={() => handleSlotClick(day, slot)} // Tıklanabilir hale getirdik
                    >
                      {slot}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">Yok</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No time slots added  yet.</p>
      )}
    </div>
  );
}
