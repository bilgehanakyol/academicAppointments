import React from 'react';

const appointments = [
  {
    academianName: 'Prof. Dr. John Doe',
    department: 'Computer Science',
    date: '2024-09-15',
    subject: 'AI Research',
    studentNumber: '2021456789',
  },
  {
    academianName: 'Dr. Jane Smith',
    department: 'Mechanical Engineering',
    date: '2024-09-18',
    subject: 'Robotics Consultation',
    studentNumber: '2021123456',
  },
  {
    academianName: 'Dr. Alan Turing',
    department: 'Mathematics',
    date: '2024-09-20',
    subject: 'Cryptography Basics',
    studentNumber: '2021543210',
  },
];

function AppointmentCard({ appointment }) {
  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md p-6 m-4">
      <h2 className="text-xl font-semibold text-gray-800">{appointment.academianName}</h2>
      <p className="text-gray-600">{appointment.department}</p>
      <p className="mt-4">
        <span className="font-medium">Randevu Tarihi:</span> {appointment.date}
      </p>
      <p>
        <span className="font-medium">Randevu Konusu:</span> {appointment.subject}
      </p>
      <p>
        <span className="font-medium">Öğrenci Numarası:</span> {appointment.studentNumber}
      </p>
    </div>
  );
}

export default function AppointmentList() {
  return (
    <div className="flex flex-wrap justify-center">
      {appointments.map((appointment, index) => (
        <AppointmentCard key={index} appointment={appointment} />
      ))}
    </div>
  );
}
