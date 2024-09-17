import { useContext, useEffect, useState } from "react";
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

export default function AvailabilityTable() {
  const { user, ready } = useContext(UserContext);
  const [availabilities, setAvailabilities] = useState({});
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (!user || !ready) return;

      try {
        const { data } = await axios.get(`/availability?userId=${user._id}`);
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
  }, [user, ready]);

  const handleSlotClick = (day, slot) => {
    setSelectedSlot({ day, slot });
    setShowModal(true);
  };

  const handleDeleteSlot = async () => {
    try {
      await axios.delete(`/availability/${user._id}`, {
        data: {
          day: selectedSlot.day,
          slot: selectedSlot.slot,
        }
      });

      setAvailabilities(prev => ({
        ...prev,
        [selectedSlot.day]: prev[selectedSlot.day].filter(s => s !== selectedSlot.slot),
      }));

      alert('Time slot successfully deleted.');
      setShowModal(false);
    } catch (error) {
      console.error('An error occurred while deleting time slots:', error);
    }
  };

  return (
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

      {showModal && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-auto">
            <h3 className="text-2xl font-semibold mb-4 text-red-600">Delete Time Slot</h3>
            <p className="text-lg mb-6 text-gray-800">{selectedSlot.day} - {selectedSlot.slot}</p>
            <div className="flex justify-between">
              <button
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200"
                onClick={handleDeleteSlot}
              >
                Delete
              </button>
              <button
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-200"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
