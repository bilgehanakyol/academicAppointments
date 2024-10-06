import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from './UserContext';

export default function StudentSearchPage() {
  const { user } = useContext(UserContext); // Mevcut kullanıcı (akademisyen)
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
      setError('Öğrenci bulunamadı.');
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
    <div className="container mx-auto p-4">
      <h2 className="text-2xl mb-4">Öğrenci Arama</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Öğrenci numarası girin"
          value={studentNo}
          onChange={(e) => setStudentNo(e.target.value)}
          className="p-2 border"
        />
        <button onClick={handleSearch} className="p-2 bg-blue-500 text-white ml-2">
          {loading ? 'Aranıyor...' : 'Ara'}
        </button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {student && (
        <div className="bg-gray-100 p-4 rounded">
          <p><strong>Ad:</strong> {student.name}</p>
          <p><strong>Soyad:</strong> {student.surname}</p>
          <p><strong>Numara:</strong> {student.studentNo}</p>
          <button onClick={handleViewAppointments} className="p-2 bg-green-500 text-white mt-2">
            Randevuları Görüntüle
          </button>
        </div>
      )}
    </div>
  );
}
