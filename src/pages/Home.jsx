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
      <div className="flex gap-5">
        <div className="w-3/4">
          <Calendar events={events} onEventClick={handleEventClick} />
        </div>
        {selectedEvent && (
          <div className="w-1/4 mr-5">
            <CheckSchedule selectedEvent={selectedEvent} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
