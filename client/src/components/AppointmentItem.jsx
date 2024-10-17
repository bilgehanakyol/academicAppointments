import React, { useState } from 'react';
import axios from 'axios';

export default function AppointmentItem({ appointment, isAcademician }) {
  const [status, setStatus] = useState(appointment.status);
  const [editMode, setEditMode] = useState(false); // Edit modunu yönetmek için
  const [newDate, setNewDate] = useState(appointment.date); // Yeni tarih
  const [newStartTime, setNewStartTime] = useState(appointment.startTime); // Yeni başlangıç saati
  const [newEndTime, setNewEndTime] = useState(appointment.endTime); // Yeni bitiş saati

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setStatus(newStatus);
      await axios.patch(`/appointments/${appointment._id}/status`, { status: newStatus });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('An error occurred while updating the appointment status.');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.patch(`/appointments/${appointment._id}`, {
        date: newDate,
        startTime: newStartTime,
        endTime: newEndTime,
      });
      setEditMode(false); // Edit modunu kapat
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('An error occurred while updating the appointment details.');
    }
  };

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-md mb-4 bg-white">
      <p className="text-lg font-semibold">
        <strong>Date:</strong> {formatDate(appointment.date)} at {appointment.startTime}
      </p>
      <p>
        <strong>{isAcademician ? 'Requested by:' : 'Academician:'}</strong> 
        {isAcademician ? `${appointment.studentId.name} ${appointment.studentId.surname}` : `${appointment.academianId.name} ${appointment.academianId.surname}`}
      </p>
      <p><strong>Student No:</strong> {appointment.studentId.studentNo}</p>
      <p><strong>Description:</strong> {appointment.description}</p>
      <p><strong>Status:</strong> {status}</p>

      {/* Pending status for accepting appointments */}
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

      {/* Confirmed status for editing */}
      {isAcademician && status === 'confirmed' && !editMode && (
        <div className="mt-2">
          <button
            onClick={() => setEditMode(true)} // Düzenleme modunu aç
            className="bg-blue-500 text-white p-2 rounded mr-2 hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleStatusChange('cancelled')}
            className="bg-red-500 text-white p-2 rounded hover:bg-red-600"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Edit mode form */}
      {isAcademician && status === 'confirmed' && editMode && (
        <form onSubmit={handleEditSubmit} className="mt-4">
          <div className="mb-2">
            <label className="block">New Date:</label>
            <input
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block">New Start Time:</label>
            <input
              type="time"
              value={newStartTime}
              onChange={(e) => setNewStartTime(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block">New End Time:</label>
            <input
              type="time"
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded mr-2 hover:bg-green-600"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => setEditMode(false)} // Düzenleme modunu kapat
            className="bg-gray-500 text-white p-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}
