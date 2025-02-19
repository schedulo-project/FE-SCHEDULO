import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./../styles/calendar.module.css"; // 스타일 적용

const Calendar = ({ events, onEventClick }) => {
  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      eventClick={onEventClick} // 일정 클릭 이벤트
      height="auto"
    />
  );
};

export default Calendar;
