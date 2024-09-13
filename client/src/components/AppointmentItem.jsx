import React, { useState } from 'react';
import axios from 'axios';

export default function AppointmentItem({ appointment, isAcademician }) {
  const [status, setStatus] = useState(appointment.status);

  const handleStatusChange = async (newStatus) => {
    try {
      await axios.patch(`/appointments/${appointment._id}`, { status: newStatus });
      setStatus(newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-md mb-4 bg-white">
      <p className="text-lg font-semibold"><strong>Tarih:</strong> {appointment.date.day} {appointment.date.slot}</p>
      {isAcademician ? (
        <>
          <p><strong>Talep Eden:</strong> {appointment.studentId.name} {appointment.studentId.surname}</p>
          <p><strong>Talep Edilen:</strong> {appointment.academianId.name} {appointment.academianId.surname}</p>
        </>
      ) : (
        <>
          <p><strong>Talep Eden:</strong> {appointment.studentId.name} {appointment.studentId.surname}</p>
          <p><strong>Talep Edilen:</strong> {appointment.academianId.name} {appointment.academianId.surname}</p>
        </>
      )}
      <p><strong>Durum:</strong> {status}</p>
      {status === 'pending' && (
        <div className="mt-2">
          <button onClick={() => handleStatusChange('accepted')} className="bg-green-500 text-white p-2 rounded mr-2 hover:bg-green-600">Accept</button>
          <button onClick={() => handleStatusChange('rejected')} className="bg-red-500 text-white p-2 rounded hover:bg-red-600">Reject</button>
        </div>
      )}
    </div>
  );
}
