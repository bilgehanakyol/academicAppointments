import './App.css'
import RegisterPage from './pages/RegisterPage'
import {Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import axios from "axios";
import ProfilePage from './pages/ProfilePage';
import { UserContextProvider } from './components/UserContext';
import AcademiciansPage from './pages/AcademicianPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import CreateAppointmentPage from './pages/CreateAppointmentPage';
import AvailabilityManager from './components/AvailabilityManager';
import CalendarView from './components/CalendarView';
import StudentSearch from './pages/StudentsPage';
import EmailVerificationPage from './pages/VerificationPage';
import AddTemplatePage from './pages/AddAppointmentTemplate';
import ResetPasswordPage from './pages/ResetPasswordPage';
import EmailResetPage from './pages/EmailResetPage';

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
      <Route path="/students" element={<StudentSearch />} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />
      <Route path="/request-reset" element={<EmailResetPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/add-appointment-template" element={<AddTemplatePage />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;