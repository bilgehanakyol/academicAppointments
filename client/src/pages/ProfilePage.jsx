import React from 'react'
import WeeklyCalendar from '../components/Calendar.jsx';
//import { UserContext } from "../UserContext.jsx";
//import { Link, Navigate, useParams } from "react-router-dom";
//import axios from "axios";
import Header from '../components/Header.jsx';

export default function ProfilePage() {
  return (
    <div>
        <Header/>
        hello profile page
        <WeeklyCalendar/>
    </div>
  )
}
