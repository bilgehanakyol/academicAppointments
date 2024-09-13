import React from 'react';
import BackButton from '../components/BackButton';
import WeeklyAvailability from '../components/degisecek';

const AppointmentsPage = () => {

    return (
        <div className='p-4'>
            <BackButton />
            <div className='mt-4'>
                <WeeklyAvailability />
            </div>
        </div>
    );
};

export default AppointmentsPage;
