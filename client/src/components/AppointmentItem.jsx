import React, { useState } from 'react';
import axios from 'axios';

export default function AppointmentItem({ appointment, isAcademician }) {
  const [status, setStatus] = useState(appointment.status);

  // Tarihi düzenlemek için bir fonksiyon
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // 24 saatlik formatta saati düzenlemek için bir fonksiyon
  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false, // 24 saatlik format için
    });
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setStatus(newStatus);
      if (newStatus === 'confirmed') {
        try {
          await axios.patch(`/appointments/${appointment._id}/status`, { status: newStatus });
        }  catch (error) {
          alert('This time has already been booked. Your appointment has been cancelled.');
        }
      } else if (newStatus === 'cancelled') {
        await axios.patch(`/appointments/${appointment._id}/status`, { status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('An error occurred while updating the appointment status.');
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-md mb-4 bg-white">
      <p className="text-lg font-semibold">
        <strong>Date:</strong> {formatDate(appointment.date)} at {formatTime(appointment.startTime)}
      </p>
      <p>
        <strong>{isAcademician ? 'Requested by:' : 'Academician:'}</strong> {isAcademician ? `${appointment.studentId.name} ${appointment.studentId.surname}` : `${appointment.academianId.name} ${appointment.academianId.surname}`}
      </p>
      <p><strong>Student No:</strong> {appointment.studentId.studentNo}</p>
      <p><strong>Description:</strong> {appointment.description}</p>
      <p><strong>Status:</strong> {status}</p>
      {isAcademician && status === 'pending' && (
        <div className="mt-2">
          <button
            onClick={() => handleStatusChange('confirmed')}
            className="bg-green-500 text-white p-2 rounded mr-2 hover:bg-green-600"
          >
            Accept
          </button>
          <button
            onClick={() => handleStatusChange('cancelled')}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
