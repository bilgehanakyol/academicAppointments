import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AppointmentForm() {
  const [academians, setAcademians] = useState([]);
  const [selectedAcademian, setSelectedAcademian] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  // Akademisyen listesini almak için useEffect

    useEffect(() => {
        axios.get('/academicians')
            .then(response => {
                setAcademians(response.data);
            })
            .catch(error => {
                console.error('Error fetching academians:', error);
            });
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("/appointments", {
        academianId: selectedAcademian,
        start: `${date}T${startTime}:00`,
        end: `${date}T${endTime}:00`,
        description,
      });
      setMessage("Randevu başarıyla oluşturuldu!");
    } catch (error) {
      setMessage("Randevu oluşturulurken bir hata oluştu.");
      console.error("Error creating appointment", error);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Randevu Oluştur</h2>
      <form onSubmit={handleSubmit}>
        {/* Akademisyen Seçimi */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Akademisyen</label>
          <select
            value={selectedAcademian}
            onChange={(e) => setSelectedAcademian(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Akademisyen Seçin</option>
            {academians.map((academian) => (
              <option key={academian._id} value={academian._id}>
                {academian.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tarih Seçimi */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Tarih</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Başlangıç Saati Seçimi */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Başlangıç Saati</label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Bitiş Saati Seçimi */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Bitiş Saati</label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>

        {/* Açıklama */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Açıklama</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Randevu açıklaması yazın"
          />
        </div>

        {/* Gönder Butonu */}
        <button
          type="submit"
          className="w-full p-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
        >
          Randevu Oluştur
        </button>
      </form>

      {/* Mesaj */}
      {message && <p className="mt-4 text-center text-green-600">{message}</p>}
    </div>
  );
}
