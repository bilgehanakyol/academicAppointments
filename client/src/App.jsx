import './App.css'
import RegisterPage from './pages/RegisterPage'
import {Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import axios from "axios";
import ProfilePage from './pages/ProfilePage';
import { UserContextProvider } from './components/UserContext';
import WeeklyCalendar from './components/Calendar';
import AcademiciansPage from './pages/AcademicianPage';
import AppointmentsPage from './pages/AppointmentsPage';
import CalendarPage from './components/Calendar';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import CreateAppointmentPage from './pages/CreateAppointmentPage';

axios.defaults.baseURL = 'http://localhost:5555';
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
      <Route path='/' element={<HomePage />} />
      <Route path='/register' element={<RegisterPage />} />
      <Route path='/login' element={<LoginPage />} />
      <Route path='/profile' element={<ProfilePage />} />
      <Route path='/appointments' element={<AppointmentsPage />} />
      <Route path='/my-appointments' element={<MyAppointmentsPage />} />
      <Route path="/create-appointment" element={<CreateAppointmentPage />} />
      <Route path='/calendar' element={<WeeklyCalendar />}/>
      <Route path='/academicians' element={<AcademiciansPage />}/>
      <Route path="calendar/:id" element={<CalendarPage />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;