import Calendar from "./Calendar";
export default function App() {
  const events = [
    {
      title: "My Event",
      start: new Date(),
      end: new Date(),
    },
  ];

  return (
    <div>
      <Calendar
        defaultView="week"
        views={["month", "week", "day"]}
        events={events}
        defaultDate={new Date()}
        style={{ height: "100vh" }}
      />
    </div>
  );
}
