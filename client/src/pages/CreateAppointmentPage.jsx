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
      alert('Appointment request created successfully!');
    } catch (error) {
      console.error('Error creating appointment request:', error);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Create Appointment Request</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block mb-2">Day: {day}</label>
        </div>
        <div className="mb-4">
          <label className="block mb-2">Time: {slot}</label>
        </div>
        <div className="mb-4">
          <textarea 
            className="border p-2 w-full" 
            placeholder="Add a description for the appointment"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded">
            Request Appointment
        </button>
      </form>
    </div>
  );
}
