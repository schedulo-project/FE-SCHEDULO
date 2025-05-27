import React from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
// import koLocale from "@fullcalendar/core/locales/ko"; // 한글 로케일 추가
import "./../styles/calendar.module.css"; // 스타일 적용
import "./../styles/global.css";
import ScheduleModal from "./ScheduleModal";
import { useAtom } from "jotai";

import {
  eventsAtoms,
  homeSidebarAtoms,
  isModalOpenAtom,
  modalDataAtom,
} from "../atoms/HomeAtoms";

const Calendar = ({ events, onDateClick, onEventClick }) => {
  const [, setIsModalOpen] = useAtom(isModalOpenAtom);

  const [modalData, setModalData] = useAtom(modalDataAtom); // 모달에 보여줄 데이터

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

  const handleAddEventClick = () => {
    const clickedEventData = {
      id: null,
      title: "",
      date: "",
      content: "",
      tagName: "",
      is_completed: false,
      deadline: null,
    };

    setModalData(clickedEventData);
    setIsModalOpen(true);
  };

  return (
    <FullCalendar
      plugins={[
        dayGridPlugin,
        timeGridPlugin,
        interactionPlugin,
      ]}
      initialView="dayGridMonth"
      customButtons={{
        myCustomButton: {
          text: "+",
          hint: "새로운 일정을 추가합니다",
          click: handleAddEventClick,
          // 추가 버튼 클릭 시 id : null 값 이므로 삭제버튼 제거, 추가버튼 생성
        },
      }}
      headerToolbar={{
        left: "prev next",
        center: "title",
        right: "myCustomButton dayGridMonth timeGridWeek",
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
