import { useContext, useEffect, useState } from "react";
import axios from 'axios';
import { UserContext } from './UserContext'; // UserContext dosyasının doğru yolunu belirtin

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
        console.error('Müsaitlikler alınırken bir hata oluştu:', error);
      }
    };

    fetchAvailabilities();
  }, [user, ready]);

  const handleSlotClick = (day, slot) => {
    setSelectedSlot({ day, slot });
    setShowModal(true); // Modalı aç
  };

  const handleAppointmentRequest = async () => {
    // Randevu talebi için backend'e POST isteği gönder
    try {
      await axios.post('/appointments', {
        day: selectedSlot.day,
        slot: selectedSlot.slot,
        student: user._id, // Mevcut kullanıcının ID'si
      });
      alert('Randevu talebi oluşturuldu.');
      setShowModal(false); // Modalı kapat
    } catch (error) {
      console.error('Randevu oluşturulurken bir hata oluştu:', error);
    }
  };

  return (
    <div className="mt-8 w-full">
      <h2 className="text-xl font-semibold mb-4">Eklenen Müsaitlikler</h2>
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
        <p>Henüz müsaitlik eklenmemiş.</p>
      )}

      {/* Modal Yapısı */}
      {showModal && selectedSlot && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white p-6 rounded shadow-lg max-w-md w-full mx-auto">
            <h3 className="text-xl mb-4">Randevu Talebi Oluştur</h3>
            <p>{selectedSlot.day} - {selectedSlot.slot}</p>
            <div className="flex justify-between mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleAppointmentRequest}
              >
                Randevu Talep Et
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                onClick={() => setShowModal(false)}
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
