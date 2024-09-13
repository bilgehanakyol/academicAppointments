import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';

export default function CreateAppointmentPage() {
  const [searchParams] = useSearchParams();
  const day = searchParams.get('day');
  const slot = searchParams.get('slot');
  const academianId = searchParams.get('academianId');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/appointments', {
        academianId,
        day,
        slot,
        description,
      });
      alert('Randevu talebi başarıyla oluşturuldu!');
    } catch (error) {
      console.error('Randevu talebi oluşturulurken bir hata oluştu:', error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Randevu Talebi Oluştur</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Gün: {day}</label>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Saat: {slot}</label>
        </div>
        <div className="mb-4">
          <textarea 
            className="border p-2 w-full" 
            placeholder="Randevu için açıklama ekleyin"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
          Randevu Talep Et
        </button>
      </form>
    </div>
  );
}
