import './App.css'
import RegisterPage from './pages/auth/RegisterPage'
import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import axios from "axios";
import ProfilePage from './pages/ProfilePage';
import { UserContextProvider } from './components/UserContext';
import AcademiciansPage from './pages/AcademicianPage';
import MyAppointmentsPage from './pages/MyAppointmentsPage';
import CreateAppointmentPage from './pages/CreateAppointmentPage';
import AvailabilityManager from './components/AvailabilityManager';
import CalendarView from './components/CalendarView';
import EmailVerificationPage from './pages/auth/VerificationPage';
import AddTemplatePage from './pages/AddAppointmentTemplate';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import EmailResetPage from './pages/auth/EmailResetPage';
import AppointmentDetails from './components/AppointmentDetails';
import StudentSearchPage from './pages/StudentSearchPage';

axios.defaults.baseURL = 'http://localhost:5555';
axios.defaults.withCredentials = true;
//TODO: linkler düzenlenecek
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
      <Route path="/appointments/students/:studentId/academians/:academianId" element={<AppointmentDetails />} />
      <Route path='/academians' element={<AcademiciansPage />}/>
      <Route path="/academians/calendar/:academianId" element={<CalendarView />} />
      <Route path="/students" element={<StudentSearchPage />} />
      <Route path="/verify-email" element={<EmailVerificationPage />} />
      <Route path="/request-reset" element={<EmailResetPage />} />
      <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
      <Route path="/add-appointment-template" element={<AddTemplatePage />} />
      </Routes>
    </UserContextProvider>
  );
}

export default App;