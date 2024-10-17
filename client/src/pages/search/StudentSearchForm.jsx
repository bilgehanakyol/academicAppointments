import React from 'react';

export default function StudentSearchForm({ studentNo, setStudentNo, handleSearch, loading }) {
  return (
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
        className="primary transition duration-200 shadow-md"
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
    </div>
  );
}
