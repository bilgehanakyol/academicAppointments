import './App.css'
import RegisterPage from './pages/RegisterPage'
import {Routes, Route} from 'react-router-dom'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import axios from "axios";
import ProfilePage from './pages/ProfilePage';
import { UserContextProvider } from './components/UserContext';
import WeeklyCalendar from './components/Calendar';

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
      <Route path='/calendar' element={<WeeklyCalendar />}/>
  </Routes>
    </UserContextProvider>
    
  )
}

export default App;