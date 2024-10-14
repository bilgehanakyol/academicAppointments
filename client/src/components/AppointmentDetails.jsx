import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import BackButton from './BackButton';
import { useParams } from 'react-router-dom';
import { UserContext } from './UserContext';
//randevu alma ekranı görünümü
export default function AppointmentDetailPage() {
  const { studentId } = useParams();
  const { user } = useContext(UserContext); 
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [notesMap, setNotesMap] = useState({});

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/appointments/students/${studentId}/academians/${user._id}`);
        setAppointments(response.data);
        const initialNotes = {};
        response.data.forEach((appointment) => {
          initialNotes[appointment._id] = appointment.notes || '';
        });
        setNotesMap(initialNotes);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Appointments could not be fetched.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [studentId, user._id]);

  // Tarihi string olarak işleyip gün, ay ve yılı ayıran fonksiyon
  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('T')[0].split('-'); // Tarih kısmını alıp bölüyoruz
    return `${day}/${month}/${year}`; // Gün/Ay/Yıl formatında döndürüyoruz
  };

  const handleNotesChange = (appointmentId, newNotes) => {
    setNotesMap((prevNotes) => ({
      ...prevNotes,
      [appointmentId]: newNotes,
    }));
  };

  const handleNotesUpdate = async (appointmentId) => {
    try {
      await axios.patch(`/appointments/${appointmentId}/notes`, { notes: notesMap[appointmentId] });
      alert('Notes successfully updated.');
    } catch (error) {
      alert('Notes update failed.');
    }
  };

  return (
    <div className="p-6">
      <BackButton />
    <div className="p-6 min-h-screen bg-gray-100">
      
      <div className="container mx-auto max-w-4xl p-6 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">Appointment Details</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading && <p>Loading...</p>}
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <div key={appointment._id} className="mb-6 p-6 bg-gray-50 border border-gray-200 rounded-lg shadow-md">
              <div className="mb-4">
                <p className="text-lg font-semibold text-gray-700">
                  <strong>Date:</strong> {formatDate(appointment.date)}
                </p>
                <p className="text-lg font-semibold text-gray-700"><strong>Description:</strong> {appointment.description}</p>
              </div>
              <p className="text-md font-medium text-gray-600 mb-2"><strong>Notes:</strong></p>
              <textarea
                value={notesMap[appointment._id] || ''}
                onChange={(e) => handleNotesChange(appointment._id, e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200 mb-4"
                rows="4"
                placeholder="Enter your notes here..."
              />
              <button
                onClick={() => handleNotesUpdate(appointment._id)}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
              >
                Update
              </button>
            </div>
          ))
        ) : (
          <p className="text-lg text-gray-700">No appointments found.</p>
        )}
      </div>
    </div>
    </div>
  );
}
