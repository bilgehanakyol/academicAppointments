import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../components/UserContext';
import { Navigate } from 'react-router-dom';
import Header from '../components/Header';
import BackButton from '../components/BackButton';

export default function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [redirect, setRedirect] = useState(null);
  const {ready, user, setUser} = useContext(UserContext);

  useEffect(() => {
    // Kullanıcının bilgilerini almak için bir API çağrısı
    async function fetchProfile() {
      try {
        const { data } = await axios.get('/profile'); // Backend'de bu route'a uygun bir endpoint olmalı
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    }
    fetchProfile();
  }, []);

  if (!profileData) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  async function logout() {
    await axios.post('/logout');
    setRedirect('/');
    setUser(null);
  }
  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className='p-4'>
      <BackButton/>
    <div className="flex flex-col items-center mt-16">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="bg-white shadow-lg rounded-lg p-6 w-96">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
          <p>{profileData.name}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Surname:</label>
          <p>{profileData.surname}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <p>{profileData.email}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Department:</label>
          <p>{profileData.department}</p>
        </div>

        {/* Kullanıcının rolüne göre dinamik alanlar */}
        {profileData.role === 'student' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Student Number:</label>
            <p>{profileData.studentNo}</p>
          </div>
        )}

        {profileData.role === 'academian' && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">Role:</label>
            <p>Academician</p>
          </div>
        )}
        <button onClick={logout}>Log out</button>
      </div>
    </div>
    </div>
  );
}
