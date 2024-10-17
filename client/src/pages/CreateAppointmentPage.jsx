import { useState, useEffect, useContext } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../components/BackButton';
import { UserContext } from '../components/UserContext';
import Button from '../components/Button';

export default function CreateAppointmentPage() {
  const { user } = useContext(UserContext);
  const [searchParams] = useSearchParams();
  const day = searchParams.get('day');
  const slot = searchParams.get('slot');
  const academianId = searchParams.get('academianId');
  const calendarSlotId = searchParams.get('slotId');
  const [description, setDescription] = useState('');
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await axios.get('/templates');
        console.log('API response:', response.data);
        setTemplates(Array.isArray(response.data.templates) ? response.data.templates : []);
      } catch (error) {
        console.error('An error occurred while fetching templates:', error);
        setTemplates([]);
      }
    };
  
    fetchTemplates();
  }, []);
  
  const handleTemplateChange = (e) => {
    const selectedId = e.target.value;
    setSelectedTemplateId(selectedId);

    const selectedTemplate = templates.find((template) => template._id === selectedId);
    if (selectedTemplate) {
      setDescription(`${selectedTemplate.title}: ${selectedTemplate.content}`);
    } else {
      setDescription('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!day || !slot) {
      alert('Gün veya saat bilgisi eksik. Lütfen doğru bilgileri kontrol edin.');
      return;
    }

    const [startTime, endTime] = slot.split('-');
    if (!startTime || !endTime) {
      alert('Saat aralığı yanlış formatta. Lütfen kontrol edin.');
      return;
    }

    try {
      await axios.post('/appointments', {
        academianId,
        calendarSlotId,
        studentNo: user.studentNo,
        date: day,
        startTime: startTime.trim(), // times are string
        endTime: endTime.trim(),
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
                Description Template:
              </label>
              <select
                className="border rounded-md p-3 w-full bg-gray-50"
                value={selectedTemplateId}
                onChange={handleTemplateChange}
              >
                <option value="">Select a template</option>
                {templates.map((template) => (
                  <option key={template._id} value={template._id}>
                    {template.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Additional Description:
              </label>
              <textarea
                className="border rounded-md p-3 w-full bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                placeholder="Add a description for appointment"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="4"
              />
            </div>
            <Button type="submit">
              Appointment Request
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
