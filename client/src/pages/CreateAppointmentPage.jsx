import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../components/BackButton';

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
    <div className='p-4'>
      <BackButton />
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Create Appointment Request
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
              placeholder="Add a description for the appointment"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition shadow-md"
          >
            Request Appointment
          </button>
        </form>
      </div>
    </div>
          
    </div>
  );
}
