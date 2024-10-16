import React from 'react';

export default function AppointmentsList({ appointments, notesMap, handleNotesChange, handleNotesUpdate }) {
  return (
    <div className="mt-6">
      <h3 className="text-2xl font-bold mb-4">Appointments</h3>
      {appointments.map((appointment) => (
        <div key={appointment._id} className="bg-white p-4 rounded-lg shadow-md mb-4">
          <p className="text-md font-medium text-gray-700">
            <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
          </p>
          <p className="text-md font-medium text-gray-700">
            <strong>Description:</strong> {appointment.description}
          </p>
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
      ))}
    </div>
  );
}
