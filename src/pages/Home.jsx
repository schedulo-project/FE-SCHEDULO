import React, { useState } from "react";
import Calendar from "../components/Calendar";
import EventForm from "../components/EventForm";
import CheckSchedule from "../components/CheckSchedule";

const Home = () => {
  const [events, setEvents] = useState([
    { title: "React 공부", date: "2025-02-20" },
    { title: "CS 시험", date: "2025-02-22" },
  ]);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const handleEventClick = (clickInfo) => {
    setSelectedEvent(clickInfo.event);
  };

  const addEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📅 내 일정</h2>
      <EventForm addEvent={addEvent} />
      <Calendar events={events} onEventClick={handleEventClick} />
      {selectedEvent && <CheckSchedule />}
    </div>
  );
};

export default Home;
