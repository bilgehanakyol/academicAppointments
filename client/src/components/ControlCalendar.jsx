import React, { useEffect, useState } from "react";
import Calendar from "./Calendar";
import axios from "axios";
import Header from "./Header";

export default function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("/my-appointments");
        const fetchedEvents = response.data.map((appointment) => ({
          title: `Randevu: ${appointment.description}`,
          start: new Date(appointment.start),
          end: new Date(appointment.end),
        }));
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching appointments", error);
      }
    };

    fetchAppointments();
  }, []);

  return (
    <div className="">
        <Header />
      <Calendar
        defaultView="week"
        views={["week"]}
        events={events}
        defaultDate={new Date()}
        style={{ height: "100vh" }}
      />
    </div>
  );
}
