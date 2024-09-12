import React, { useState } from 'react';

// Helper function to get week dates
const getWeekDates = () => {
  const startDate = new Date();
  const dayOfWeek = startDate.getDay();
  const startOfWeek = new Date(startDate.setDate(startDate.getDate() - dayOfWeek + 1));

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    // Format date to show day, month, and year
    return date.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  });
};

export default function DenemeCalendar() {
  const [weekDates] = useState(getWeekDates());

  return (
    <div className="grid grid-cols-[auto_repeat(7,_1fr)] grid-rows-[auto_repeat(16,_1fr)] w-full h-full p-4 bg-gray-100">
      {/* Left sidebar with common time slots */}
      <div className="bg-gray-200 p-4 border-r border-gray-300 row-span-full">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Saatler</h2>
        {/* Time slots from 08:00 to 23:00 */}
        {Array.from({ length: 16 }, (_, i) => {
          const hour = i + 8;
          return (
            <div key={i} className="border-b border-gray-300 py-4 text-sm text-gray-600">
              {hour}:00
            </div>
          );
        })}
      </div>

      {/* Main calendar view */}
      <div className="flex flex-col col-start-2 col-end-[-1] row-start-1 row-end-[-1]">
        <div className="grid grid-cols-7 border-b border-gray-300 bg-gray-200">
          {weekDates.map((date, index) => (
            <div key={index} className="border-r border-gray-300 p-4 text-center font-semibold text-gray-700">
              {date}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 flex-1">
          {weekDates.map((_, index) => (
            <div key={index} className="border-r border-gray-300 flex flex-col">
              {Array.from({ length: 16 }, (_, i) => (
                <div key={i} className={`border-b border-gray-300 flex-1 flex items-center justify-center ${i % 2 === 0 ? 'bg-gray-50' : ''}`}>
                  {/* Content area for each day */}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
