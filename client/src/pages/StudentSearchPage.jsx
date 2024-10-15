import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../components/UserContext';
import BackButton from '../components/BackButton';
import AppointmentDetailPage from '../components/AppointmentDetails';

export default function StudentSearchPage() {
  const { user } = useContext(UserContext); 
  const [studentNo, setStudentNo] = useState('');
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async () => {
    setLoading(true);
    try {
const response = await axios.get(`/students/search?studentNo=${studentNo}`);
      setStudent(response.data);
      setError('');
    } catch (error) {
      setError('Student not found.');
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  const handleViewAppointments = () => {
    if (student) {
      navigate(`/appointments/students/${student._id}/academians/${user._id}`);
    }
  };

  return (
    <div className="p-4">
      <BackButton />
    <div className="min-h-screen bg-gray-100 p-4">
    <h2 className="text-3xl font-semibold text-center mb-4 text-gray-800">Search Student</h2>
      <div className="bg-white shadow-lg rounded-lg p-6 mb-4">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Enter student number"
            value={studentNo}
            onChange={(e) => setStudentNo(e.target.value)}
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition duration-200"
            />
          <button
            onClick={handleSearch}
            className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
            >
            {loading ? 'Searching...' : 'Seacrh'}
          </button>
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {student && (
          <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            <p className="text-lg font-medium text-gray-700">
              <strong>Name:</strong> {student.name}
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong>Surname:</strong> {student.surname}
            </p>
            <p className="text-lg font-medium text-gray-700">
              <strong>Number:</strong> {student.studentNo}
            </p>
            <button
              onClick={handleViewAppointments}
              className="w-full mt-4 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-200 shadow-md"
            >
              View Appointments
            </button>
          </div>
        )}
      </div>
    </div>
    </div>
    
  );
  
}
