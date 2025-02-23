import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./../styles/calendar.module.css"; // 스타일 적용

const Calendar = ({ events, onEventClick, onDateClick }) => {
  // 날짜 클릭 이벤트 핸들러
  const handleDateClick = (info) => {
    if (onDateClick) {
      onDateClick(info.dateStr);
    }
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      eventClick={onEventClick} // 일정 클릭 이벤트
      dateClick={handleDateClick}
      height="auto"
    />
  );
};

export default Calendar;
