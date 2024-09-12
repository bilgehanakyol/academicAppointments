import React from 'react';
import { Link } from 'react-router-dom';
import BackButton from '../components/BackButton';
import DenemeCalendar from '../components/deneme';
import AppointmentList from '../components/academiancarddeneme';
import AvailabilityForm from '../components/akademisyenavalibeneme';
import WeeklyAvailability from '../components/akademisyenavalibeneme';
import AvailabilityList from '../components/fok';

const AppointmentsPage = () => {
    const academianId = '66e1e5864f0f6c244d6be5de'; // Test amaçlı akademisyen ID'si

    return (
        <div className='p-4'>
            <BackButton />
            {/* <div className="App h-screen bg-gray-50">
                <div className="mt-4">
                    <Link to={`/academicians/${academianId}/calendar`}>
                        <button className="primary">Go to Academician Calendar</button>
                    </Link>
                </div>
            </div> */}
            {/* <AppointmentList /> */}
              <WeeklyAvailability />  
            {/* { <AvailabilityList /> } */}
        </div>
    );
};

export default AppointmentsPage;
