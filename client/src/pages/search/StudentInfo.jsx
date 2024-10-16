import React from 'react';

export default function StudentInfo({ student }) {
  return (
    <div className="bg-gray-50 p-2 rounded-lg shadow-md">
      <p className="text-lg font-medium text-gray-700">
        <strong>Name:</strong> {student.name}
      </p>
      <p className="text-lg font-medium text-gray-700">
        <strong>Surname:</strong> {student.surname}
      </p>
      <p className="text-lg font-medium text-gray-700">
        <strong>Number:</strong> {student.studentNo}
      </p>
    </div>
  );
}
