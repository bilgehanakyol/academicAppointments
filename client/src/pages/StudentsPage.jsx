import React, { useState } from 'react';
import axios from 'axios';

export default function StudentSearchForm({ onSearchResult }) {
  const [studentNo, setStudentNo] = useState('');

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/students?studentNo=${studentNo}`);
      if (response.data) {
        onSearchResult(response.data); // onSearchResult fonksiyonunu doğru şekilde çağırıyoruz.
      }
    } catch (error) {
      console.error('Arama işlemi sırasında hata oluştu:', error);
    }
  };

  return (
    <div className="flex flex-col">
      <input
        type="text"
        value={studentNo}
        onChange={(e) => setStudentNo(e.target.value)}
        placeholder="Öğrenci Numarası"
        className="mb-4 p-2 border rounded"
      />
      <button
        onClick={handleSearch}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300"
      >
        Ara
      </button>
    </div>
  );
}
