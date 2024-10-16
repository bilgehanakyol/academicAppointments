import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../components/UserContext';
import BackButton from '../../components/BackButton';

export default function StudentSearchPage() {
  const { user } = useContext(UserContext); 
  const [notesMap, setNotesMap] = useState({});
  const [studentNo, setStudentNo] = useState('');
  const [student, setStudent] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/students/search?studentNo=${studentNo}`);
      setStudent(response.data);
      setError('');

      // Öğrenciyi bulduktan sonra, randevuları çekiyoruz
      const appointmentsResponse = await axios.get(`/appointments/${response.data._id}/${user._id}`);
      setAppointments(appointmentsResponse.data);

      // notesMap state'ini ayarlıyoruz
      const initialNotes = {};
      appointmentsResponse.data.forEach((appointment) => {
        initialNotes[appointment._id] = appointment.notes || ''; // Boş ise varsayılan olarak boş string ver
      });
      setNotesMap(initialNotes);

    } catch (error) {
      setError('Student not found.');
      setStudent(null);
      setAppointments([]); // Hata durumunda randevuları sıfırlıyoruz
    } finally {
      setLoading(false);
    }
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
    <div className="p-4">
      <BackButton />
      <div className="min-h-screen bg-gray-100 p-2">
        <div className="bg-white shadow-lg rounded-lg p-2 mb-4">
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
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          {student && (
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
          )}

          {appointments.length > 0 && (
            <div className="mt-6 items-center justify-center ">
              <h3 className="text-2xl justify-center items-center font-bold mb-4">Appointments</h3>
              {appointments.map((appointment) => (
                <div key={appointment._id} className="bg-white p-4 rounded-lg shadow-md mb-4">
                  <p className="text-md font-medium text-gray-700">
                    <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
                  </p>
                  <p className="text-md font-medium text-gray-700">
                    <strong>Description:</strong> {appointment.description}
                  </p>
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
                    className="w-full primary transition duration-200 shadow-md"
                  >
                    Update
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
