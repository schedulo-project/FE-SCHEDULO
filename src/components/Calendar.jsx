import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// import koLocale from "@fullcalendar/core/locales/ko"; // 한글 로케일 추가
import "./../styles/calendar.module.css"; // 스타일 적용
import "./../styles/global.css";
import ScheduleModal from "./ScheduleModal";

const Calendar = ({ events, onDateClick, onEventClick }) => {
  // 날짜 클릭 이벤트 핸들러
  const handleDateClick = (info) => {
    if (onDateClick) {
      onDateClick(info.dateStr);
    }
  };

  // 날짜 셀 내용 커스터마이징(숫자로만 나오게)
  const renderDayCellContent = (dayCellInfo) => {
    return <span>{dayCellInfo.date.getDate()}</span>; // 숫자만 표시
  };

  return (
    <FullCalendar
      plugins={[
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin,
      ]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: "prev,next",
        center: "title",
        right: "dayGridMonth,timeGridWeek",
      }}
      locale="ko"
      events={events}
      dateClick={handleDateClick}
      dayCellContent={renderDayCellContent} // 날짜 셀 내용 커스터마이징
      height="auto"
      eventClick={onEventClick}
    />
  );
};

export default Calendar;
