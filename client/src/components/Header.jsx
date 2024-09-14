import { Link, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';

export default function Header() {
  const { user, ready } = useContext(UserContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (ready) {
      setLoading(false);
      if (!user) {
        navigate('/login');
      }
    }
  }, [ready, user, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <header className="flex justify-between mt-4 pl-2">
      <Link to={'/'} className="flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 -rotate-90">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
        </svg>
        <span className="font-bold text-xl">İSTE</span>
      </Link>
      <div className="flex items-center gap-4">
        {user?.role === 'student' ? (
          <>
            <Link to="/academicians" className="border px-4 py-2 rounded-full shadow-md hover:bg-gray-100">
              Academicians
            </Link>
            <Link to="/my-appointments" className="border px-4 py-2 rounded-full shadow-md hover:bg-gray-100">
              My Appointments
            </Link>
          </>
        ) : user?.role === 'academician' ? (
          <>
            <Link to="/appointments" className="border px-4 py-2 rounded-full shadow-md hover:bg-gray-100">
              Schedule Appointment
            </Link>
            <Link to="/my-appointments" className="border px-4 py-2 rounded-full shadow-md hover:bg-gray-100">
              My Appointments
            </Link>
          </>
        ) : null}
      </div>
      <Link to={user ? '/profile' : '/login'} className="flex items-center border gap-2 border-gray-300 rounded-full py-2 px-4 shadow-md shadow-gray-300 mr-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        <div className='bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden'>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 -relative top-1">
            <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
          </svg>
        </div>
      </Link>
    </header>
  );
}
