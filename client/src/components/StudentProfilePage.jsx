import React from 'react';

export default function StudentProfilePage({ /*student, appointments, pendingAppointments*/ }) {
    const student = {
        studentNumber: '123456',
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        department: 'Computer Science',
      };
    
      // Temsili randevularım
      const appointments = [
        {
          academicName: 'Dr. Mehmet Aksoy',
          academicDepartment: 'Computer Engineering',
          time: '14:00',
          day: 'Monday',
        },
        {
          academicName: 'Prof. Ayşe Kılıç',
          academicDepartment: 'Mathematics',
          time: '10:00',
          day: 'Wednesday',
        },
      ];
    
      // Temsili onay bekleyen randevularım
      const pendingAppointments = [
        {
          academicName: 'Assoc. Prof. Ali Can',
          academicDepartment: 'Physics',
          time: '09:00',
          day: 'Friday',
        },
      ];
    
  return (
    <div className="container mx-auto px-4 py-6">
      {/* Öğrenci Bilgileri */}
      <div className="bg-gray-100 p-4 rounded-lg shadow-lg mb-6">
        <h1 className="text-2xl font-bold mb-4">Student Profile</h1>
        <p><strong>Student Number:</strong> {student.studentNumber}</p>
        <p><strong>Name:</strong> {student.firstName} {student.lastName}</p>
        <p><strong>Department:</strong> {student.department}</p>
      </div>

      {/* Randevularım */}
      <div className="bg-blue-100 p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-bold mb-4">My Appointments</h2>
        <ul>
          {appointments.length ? (
            appointments.map((appointment, index) => (
              <li key={index} className="mb-2">
                <strong>Academic:</strong> {appointment.academicName} - {appointment.academicDepartment} <br />
                <strong>Time:</strong> {appointment.time} <br />
                <strong>Day:</strong> {appointment.day}
              </li>
            ))
          ) : (
            <p>No appointments yet.</p>
          )}
        </ul>
      </div>

      {/* Onay Bekleyen Randevularım */}
      <div className="bg-yellow-100 p-4 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-bold mb-4">Pending Appointments</h2>
        <ul>
          {pendingAppointments.length ? (
            pendingAppointments.map((appointment, index) => (
              <li key={index} className="mb-2">
                <strong>Academic:</strong> {appointment.academicName} - {appointment.academicDepartment} <br />
                <strong>Time:</strong> {appointment.time} <br />
                <strong>Day:</strong> {appointment.day}
              </li>
            ))
          ) : (
            <p>No pending appointments.</p>
          )}
        </ul>
      </div>

      {/* Yatay Ortalanmış Kare */}
      <div className="flex justify-center items-center">
        <div className="bg-red-500 w-52 h-52 flex items-center justify-center">
          <p className="text-white">Centered Box</p>
        </div>
      </div>
    </div>
  );
}
