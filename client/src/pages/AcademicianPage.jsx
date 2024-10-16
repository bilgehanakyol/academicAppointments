import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../components/BackButton';

export default function AcademiansPage() {
    const [academians, setAcademians] = useState([]);

    useEffect(() => {
        axios.get('/academians')
            .then(response => {
                setAcademians(response.data);
            })
            .catch(error => {
                console.error('Error fetching academians:', error);
            });
    }, []);

    return (
        <div className='p-4'>
            <BackButton />
            <div className="container mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6 text-center">Academians</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {academians.map(academian => (
                        <div key={academian._id} className="bg-white border border-gray-200 rounded-lg shadow-md p-6 transition-transform transform hover:scale-105">
                            <h2 className="text-xl font-semibold mb-2">{academian.name} {academian.surname}</h2>
                            <p className="text-gray-600 mb-4">{academian.department}</p>
                            <Link to={`/academians/calendar/${academian._id}`}
                            className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors">
                                View Calendar
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
