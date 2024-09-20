import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BackButton from './BackButton';

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
          availabilityData[day.day] = day.slots.map(slot => slot.date).filter(date => date);
        });
        setAvailabilities(availabilityData);
      } catch (error) {
        console.error('An error occurred while retrieving time slots:', error);
      }
    };

    fetchAvailabilities();
  }, [id]);

  const handleSlotClick = (day, slot) => {
    navigate(`/create-appointment?day=${day}&slot=${slot}&academianId=${id}`);
  };

  return (
    <div className='p-4'>

   <BackButton />
    <div className="mt-8 w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Available Time Slots</h2>
      {Object.keys(availabilities).length > 0 ? (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-6">
            {daysOfWeek.map((day) => (
              <div key={day} className="border p-4 bg-gray-50 rounded-lg shadow-sm">
                <h3 className="font-bold text-center mb-4 text-indigo-600">{day}</h3>
                {availabilities[day] && availabilities[day].length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {availabilities[day].map((slot, index) => (
                      <button
                        key={index}
                        className="border p-2 bg-white rounded-lg shadow hover:bg-indigo-100 transition-colors duration-200 text-center font-medium text-gray-700"
                        onClick={() => handleSlotClick(day, slot)}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500 italic">No available slots</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center mt-10">
          <p className="text-xl text-gray-500">No time slots added yet.</p>
        </div>
      )}
    </div>
    </div>
  );
}
