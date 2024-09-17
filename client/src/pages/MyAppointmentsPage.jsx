import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AppointmentItem from '../components/AppointmentItem';
import { UserContext } from '../components/UserContext';
import BackButton from '../components/BackButton';

export default function MyAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(UserContext);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get('/my-appointments');
        setAppointments(response.data || []);
      } catch (error) {
        setAppointments([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  const isAcademician = user?.role === 'academician';

  // Randevuları durumlarına göre filtrele
  const pendingAppointments = appointments.filter(app => app.status === 'pending');
  const acceptedAppointments = appointments.filter(app => app.status === 'accepted');
  const rejectedAppointments = appointments.filter(app => app.status === 'rejected');

  return (
    <div className="p-4">
      <BackButton />
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-4">My Appointments</h1>
        {appointments.length === 0 ? (
          <p>No appointments found.</p>
        ) : (
          <>
            {pendingAppointments.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Pending Appointments</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {pendingAppointments.map(appointment => (
                    <AppointmentItem key={appointment._id} appointment={appointment} isAcademician={isAcademician} />
                  ))}
                </div>
              </div>
            )}

            {acceptedAppointments.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Accepted Appointments</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {acceptedAppointments.map(appointment => (
                    <AppointmentItem key={appointment._id} appointment={appointment} isAcademician={isAcademician} />
                  ))}
                </div>
              </div>
            )}

            {rejectedAppointments.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-bold mb-2">Rejected Appointments</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {rejectedAppointments.map(appointment => (
                    <AppointmentItem key={appointment._id} appointment={appointment} isAcademician={isAcademician} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
