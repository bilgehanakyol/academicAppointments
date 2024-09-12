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

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Eklenen Müsaitlikler</h2>
      {Object.keys(availabilities).length > 0 ? (
        <table className="w-full bg-white border-collapse border border-gray-300 rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Gün</th>
              <th className="border p-2">Dilimler</th>
            </tr>
          </thead>
          <tbody>
            {daysOfWeek.map((day) => (
              <tr key={day}>
                <td className="border p-2 text-center font-semibold">{day}</td>
                <td className="border p-2 text-center">
                  {availabilities[day] && availabilities[day].length > 0 ? (
                    availabilities[day].join(', ')
                  ) : (
                    'Yok'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Henüz müsaitlik eklenmemiş.</p>
      )}
    </div>
  );
}
