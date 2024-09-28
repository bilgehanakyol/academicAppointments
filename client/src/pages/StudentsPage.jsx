import React, { useState } from 'react';
import axios from 'axios';
import BackButton from '../components/BackButton';

export default function StudentSearch() {
  const [student, setStudent] = useState(null);
  const [studentNo, setStudentNo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Belirli bir öğrenciyi numarasına göre ara
  const handleSearch = async () => {
    if (!studentNo) return;

    try {
      setLoading(true);
      setError('');
      const response = await axios.get(`/students/search?studentNo=${studentNo}`);
      setStudent(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setError('Öğrenci bulunamadı.');
      } else {
        setError('Öğrenci aranırken bir hata oluştu.');
      }
      setStudent(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <BackButton />
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Öğrenci Arama</h2>

        <div className="mb-6">
          <input
            type="text"
            value={studentNo}
            onChange={(e) => setStudentNo(e.target.value)}
            placeholder="Öğrenci Numarasını Girin"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          />
        </div>

        <button
          onClick={handleSearch}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {loading ? 'Aranıyor...' : 'Ara'}
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg text-center transition duration-300 ease-in-out">
            {error}
          </div>
        )}

        {student && (
          <div className="mt-6 bg-green-100 p-4 rounded-lg shadow-md transition duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-green-700 mb-2">Öğrenci Bilgileri</h3>
            <p><span className="font-bold">Ad:</span> {student.name}</p>
            <p><span className="font-bold">Soyad:</span> {student.surname}</p>
            <p><span className="font-bold">Email:</span> {student.email}</p>
            <p><span className="font-bold">Numara:</span> {student.studentNo}</p>
          </div>
        )}

        {!loading && !error && !student && (
          <div className="mt-4 text-gray-500 text-center">Öğrenci numarasını girin ve aramaya başlayın.</div>
        )}
      </div>
    </div>
  );
}
