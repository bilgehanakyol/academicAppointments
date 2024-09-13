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
  const [selectedSlot, setSelectedSlot] = useState(null); // Seçilen zaman dilimi
  const [showModal, setShowModal] = useState(false); // Modal görünürlüğü

  useEffect(() => {
    const fetchAvailabilities = async () => {
      if (!user || !ready) return; // Kullanıcı bilgileri hazır değilse veya kullanıcı yoksa, veriyi getirme

      try {
        const { data } = await axios.get(`/availability?userId=${user._id}`);
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
  }, [user, ready]);

  const handleSlotClick = (day, slot) => {
    setSelectedSlot({ day, slot });
    setShowModal(true); // Modalı aç
  };

  const handleDeleteSlot = async () => {
    try {
      await axios.delete(`/availability/${user._id}`, {
        data: {
          day: selectedSlot.day,
          slot: selectedSlot.slot,
        }
      });

      // Silme işlemi başarılı olduktan sonra durumu güncelle
      setAvailabilities(prev => ({
        ...prev,
        [selectedSlot.day]: prev[selectedSlot.day].filter(s => s !== selectedSlot.slot),
      }));

      alert('Time slot succesfully deleted.');
      setShowModal(false); // Modalı kapat
    } catch (error) {
      console.error('An error occurred while deleting time slots:', error);
    }
  };

  return (
    <div className="mt-8 w-full">
      <h2 className="text-xl font-semibold mb-4">Added time slots </h2>
      {Object.keys(availabilities).length > 0 ? (
        <div className="overflow-x-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4">
            {daysOfWeek.map((day) => (
              <div key={day} className="border p-2 bg-gray-100 min-w-[120px] sm:min-w-[150px]">
                <h3 className="font-semibold text-center mb-2">{day}</h3>
                {availabilities[day] && availabilities[day].length > 0 ? (
                  <div className="grid grid-cols-1 gap-2">
                    {availabilities[day].map((slot, index) => (
                      <button
                        key={index}
                        className="border p-2 bg-white rounded shadow hover:bg-gray-200 w-full text-center"
                        onClick={() => handleSlotClick(day, slot)} // Tıklama işlevi
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">Yok</p>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No time slots added yet.</p>
      )}

      {/* Modal Yapısı */}
      {showModal && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full mx-auto">
            <h3 className="text-xl mb-4">Delete time slot</h3>
            <p>{selectedSlot.day} - {selectedSlot.slot}</p>
            <div className="flex justify-between mt-4">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={handleDeleteSlot}
              >
                Delete time slot
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
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
