// src/components/AvailabilityForm.js
import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { UserContext } from './UserContext';
import { addAvailability } from '../api/availability';

const AvailabilityForm = () => {
  const [day, setDay] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [profileData, setProfileData] = useState(null);
  const { user } = useContext(UserContext);

  useEffect(() => {
    // Kullanıcının profil bilgilerini almak için
    async function fetchProfile() {
      try {
        const { data } = await axios.get('/profile'); // Backend'de uygun bir route olmalı
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    }

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (profileData) {
      try {
        const result = await addAvailability(day, timeSlots, profileData._id);
        console.log('Müsaitlik başarıyla eklendi:', result);
      } catch (error) {
        console.error('Müsaitlik eklenirken bir hata oluştu:', error);
      }
    }
  };

  if (!profileData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>Day:</label>
      <input value={day} onChange={(e) => setDay(e.target.value)} required />
      
      <label>Time Slots:</label>
      <input value={timeSlots} onChange={(e) => setTimeSlots(e.target.value.split(','))} required />

      <button type="submit">Add Availability</button>
    </form>
  );
};

export default AvailabilityForm;
