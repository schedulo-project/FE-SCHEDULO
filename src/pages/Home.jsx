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

  // 날짜 클릭 시 해당 날짜의 일정 띄우기
  const handleDateClick = (date) => {
    const eventOnDate = events.find((event) => event.date === date);
    if (eventOnDate) {
      setSelectedEvent(eventOnDate);
    } else {
      setSelectedEvent(null);
    }
  };

  // 새로운 이벤트 추가
  const addEvent = (newEvent) => {
    setEvents([...events, newEvent]);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📅 내 일정</h2>
      <EventForm addEvent={addEvent} />
      <div className="flex gap-5">
        <div className="w-3/4">
          <Calendar
            events={events}
            onEventClick={handleEventClick}
            onDateClick={handleDateClick}
          />
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
