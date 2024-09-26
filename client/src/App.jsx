import './App.css'
import RegisterPage from './pages/RegisterPage'
import {Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import axios from "axios";
import ProfilePage from './pages/ProfilePage';
import { UserContextProvider } from './components/UserContext';
import AcademiciansPage from './pages/AcademicianPage';
import AppointmentsPage from './pages/AppointmentsPage';
import CalendarPage from './components/Calendar';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import CreateAppointmentPage from './pages/CreateAppointmentPage';
import ControlCalendar from './components/ControlCalendar';
import AppointmentForm from './pages/AppointmentFormPage';
import AvailabilityManager from './components/AvailabilityManager';
import CalendarView from './components/CalendarView';

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
      <Route path='/appointments' element={<AvailabilityManager />} />
      <Route path='/my-appointments' element={<MyAppointmentsPage />} />
      <Route path="/create-appointment" element={<CreateAppointmentPage />} />
      <Route path='/academicians' element={<AcademiciansPage />}/>
      <Route path="calendar/:academianId" element={<CalendarView />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;