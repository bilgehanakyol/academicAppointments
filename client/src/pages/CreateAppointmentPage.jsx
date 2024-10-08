import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../components/BackButton';

export default function CreateAppointmentPage() {
  const [searchParams] = useSearchParams();
  const day = searchParams.get('day');
  const slot = searchParams.get('slot');
  const academianId = searchParams.get('academianId');
  const calendarSlotId = searchParams.get('slotId');
  const [description, setDescription] = useState('');

  // Slot formatı: 'HH:mm - HH:mm'
  const [startTime, endTime] = slot.split(' - ');

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Değerlerin kontrolü
    if (!day || !slot) {
      alert('Gün veya saat bilgisi eksik. Lütfen doğru bilgileri kontrol edin.');
      return;
    }
  
    console.log('Submitting with day:', day, 'and slot:', slot); // Hata ayıklama için log
  
    const [startTime, endTime] = slot.split('-');
    if (!startTime || !endTime) {
      alert('Saat aralığı yanlış formatta. Lütfen kontrol edin.');
      return;
    }
  
    const appointmentDate = new Date(); // Bugünün tarihi
    appointmentDate.setUTCHours(0, 0, 0, 0); // Sadece tarih kısmı
  
    // Start ve End zamanlarını oluştur
    const start = new Date(appointmentDate);
    const end = new Date(appointmentDate);
  
    // Başlangıç ve bitiş saatlerini ayarlayın
    const [startHour, startMinute] = startTime.split(':');
    const [endHour, endMinute] = endTime.split(':');
  
    start.setUTCHours(startHour, startMinute);
    end.setUTCHours(endHour, endMinute);
  
    try {
      await axios.post('/appointments', {
        academianId,
        calendarSlotId,
        date: day,  // Gün bilgisi burada tarih formatında kullanılabilir
        startTime: slot.split('-')[0],  // Slot'un başlangıç saati
        endTime: slot.split('-')[1],  // Slot'un bitiş saati
        description,
    });
      alert('Randevu talebi başarıyla oluşturuldu!');
    } catch (error) {
      console.error('Randevu talebi oluşturulurken hata oluştu:', error);
      alert('Randevu talebi oluşturulurken hata oluştu. Lütfen tekrar deneyin.');
    }
  };
  

  return (
    <div className="p-4">
      <BackButton />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Appointment Request
          </h2>
          <form onSubmit={handleSubmit}>    
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Day: 
              </label>
              <div className="bg-gray-100 p-3 rounded-md text-gray-600 mt-1">
                {day}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Time: 
              </label>
              <div className="bg-gray-100 p-3 rounded-md text-gray-600 mt-1">
                {slot}
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Description:
              </label>
              <textarea
                className="border rounded-md p-3 w-full bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                placeholder="Randevu için bir açıklama ekleyin"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-md"
            >
              Appointment Request
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
