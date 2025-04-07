import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./../styles/calendar.module.css"; // 스타일 적용
import "./../styles/global.css";

const Calendar = ({ events, onDateClick }) => {
  // 날짜 클릭 이벤트 핸들러
  const handleDateClick = (info) => {
    if (onDateClick) {
      onDateClick(info.dateStr);
    }
  };

  // const renderEventContent = (eventInfo) => {
  //   // "..." 일정에만 특정 클래스 추가
  //   const isDotsEvent = eventInfo.event.title === "...";
  //   return (
  //     <div
  //       className={
  //         isDotsEvent ? "event-item-dots" : "event-item"
  //       }
  //       title={eventInfo.event.title}
  //     >
  //       {eventInfo.event.title}
  //     </div>
  //   );
  // };

  return (
    <FullCalendar
      plugins={[
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin,
      ]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      }}
      events={events}
      dateClick={handleDateClick}
      height="auto"
      // eventContent={renderEventContent} // 커스텀 이벤트 렌더링
    />
  );
};

export default Calendar;
