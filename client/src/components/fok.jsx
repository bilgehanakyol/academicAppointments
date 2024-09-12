import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AvailabilityList = () => {
  const [availability, setAvailability] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Kullanıcının takvimini almak için API'ye istek yapar
    const fetchAvailability = async () => {
      try {
        const response = await axios.get('/availability', {
          withCredentials: true, // Çerezlerin ve oturum bilgilerini dahil et
        });
        setAvailability(response.data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchAvailability();
  }, []);

  return (
    <div>
      <h1>Müsaitlikler</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {availability.length > 0 ? (
        <ul>
          {Object.keys(availability[0]).map((day, index) => (
            day !== '_id' && day !== 'slots' && availability[0][day].length > 0 && (
              <li key={index}>
                <h2>{day}</h2>
                <ul>
                  {availability[0][day].map((slot, i) => (
                    <li key={i}>
                      {slot}
                    </li>
                  ))}
                </ul>
              </li>
            )
          ))}
        </ul>
      ) : (
        <p>Henüz müsaitlik bulunmuyor.</p>
      )}
    </div>
  );
};

export default AvailabilityList;


