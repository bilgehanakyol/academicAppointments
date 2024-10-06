import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { UserContext } from './UserContext';

export default function AppointmentDetailPage() {
  const { studentId, academianId } = useParams(); // URL'den studentId ve academianId'yi al
  const { user } = useContext(UserContext); // Current user (academician)
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        // Axios get isteği yaparken parametreleri doğru kullan
        const response = await axios.get(`/appointments/students/${studentId}/academians/${user._id}`);
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setError('Appointments could not be fetched.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [studentId, user._id]);

  const handleDescriptionUpdate = async (appointmentId, newDescription) => {
    try {
      await axios.patch(`/appointments/${appointmentId}`, { description: newDescription });
      alert('Notes succesfully updated.');
    } catch (error) {
      alert('Notes update failed.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Randevu Detayları</h2>
      {error && <p className="text-red-500">{error}</p>}
      {loading && <p>Loading...</p>}   
      {appointments.length > 0 ? (
        appointments.map((appointment) => (
          <div key={appointment._id} className="mb-4 p-4 border rounded">
            <p><strong>Date:</strong> {appointment.date}</p>
            <p><strong>Description:</strong> {appointment.description}</p>
            <p><strong>Notes:</strong> {appointment.notes}</p>
            <textarea
              value={appointment.notes}
              onChange={(e) => handleDescriptionUpdate(appointment._id, e.target.value)}
              className="p-2 border w-full"
              placeholder="Yeni açıklama girin"
            />
          </div>
        ))
      ) : (
        <p>Hiç randevu bulunamadı.</p>
      )}
    </div>
  );
}
