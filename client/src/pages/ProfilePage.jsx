import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../components/UserContext';
import { Navigate } from 'react-router-dom';
import BackButton from '../components/BackButton';
import QRCode from 'qrcode'; 

export default function ProfilePage() {
  const [profileData, setProfileData] = useState(null);
  const [redirect, setRedirect] = useState(null);
  const { ready, user, setUser } = useContext(UserContext);
  const [qrCode, setQrCode] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const { data } = await axios.get('/auth/profile');
        setProfileData(data);

        QRCode.toDataURL(data.email, { width: 128 }, (err, url) => {
          if (err) {
            console.error('Error generating QR code:', err);
          } else {
            setQrCode(url);
          }
        });
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
    await axios.get('/auth/logout');
    setRedirect('/');
    setUser(null);
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div className='p-4'>
      <BackButton />
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

          <button className='primary' onClick={logout}>Log out</button>
          <div className="mt-8 flex flex-col items-center">
            <h2 className="text-xl font-semibold mb-4">QR Code</h2>
            {qrCode && <img src={qrCode} alt="QR Code" />}
            <p className="text-gray-600 mt-2 text-center">Scan this QR code to view your email.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
