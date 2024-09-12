import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import { UserContext } from '../components/UserContext';

const HomePage = () => {
  const { user, ready } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (ready) {
      if (user?.role === 'academician') {
        navigate('/calendar'); // Eğer kullanıcı akademisyen ise calendar sayfasına yönlendir
      } else if (user?.role === 'student') {
        navigate('/'); // Eğer kullanıcı öğrenci ise öğrenci profiline yönlendir
      }
    }
  }, [ready, user, navigate]);

  return (
    <div>
      <Header />
    </div>
  );
};

export default HomePage;
