import React from "react";
import {
  Calendar as BigCalendar,
  momentLocalizer,
  Views,
} from "react-big-calendar";
import moment from "moment";
import "moment/locale/ko"; // 한국어 로케일 import
import "react-big-calendar/lib/css/react-big-calendar.css";
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

// moment localizer 설정
moment.locale("ko");
const localizer = momentLocalizer(moment);

const Calendar = ({ events, onDateClick, onEventClick }) => {
  const [, setIsModalOpen] = useAtom(isModalOpenAtom);
  const [modalData, setModalData] = useAtom(modalDataAtom); // 모달에 보여줄 데이터

  // react-big-calendar용 이벤트 형식으로 변환
  const formattedEvents =
    events?.map((event) => {
      // date가 있으면 사용하고, 없으면 start 사용
      const eventDate = event.date || event.start;
      const startDate = new Date(eventDate);

      // deadline이 있으면 deadline까지, 없으면 하루짜리 이벤트
      let endDate;
      if (event.deadline) {
        endDate = new Date(event.deadline);
        // deadline이 있는 경우, deadline 다음날을 end로 설정 (react-big-calendar는 end를 exclusive로 처리)
        endDate.setDate(endDate.getDate());
      } else {
        // deadline이 없으면 하루 종일 이벤트로 설정
        endDate = new Date(eventDate);
        endDate.setDate(endDate.getDate() + 1);
      }

      return {
        ...event,
        start: startDate,
        end: endDate,
        title: event.title,
        resource: event, // 원본 이벤트 데이터를 resource에 저장
      };
    }) || [];

  // 날짜 클릭 이벤트 핸들러 (슬롯 선택)
  const handleSlotSelect = ({ start, end }) => {
    if (onDateClick) {
      onDateClick(moment(start).format("YYYY-MM-DD"));
    }
  };

  // 이벤트 클릭 핸들러
  const handleEventSelect = (event) => {
    if (onEventClick) {
      // FullCalendar 형식에 맞게 변환
      const clickInfo = {
        event: {
          id: event.id,
          title: event.title,
          extendedProps: {
            tagName: event.tagName,
            tagColor: event.tagColor,
            is_completed: event.is_completed,
            deadline: event.deadline,
            content: event.content || "", // 내용 추가
          },
          startStr: moment(event.start).format("YYYY-MM-DD"),
        },
      };
      onEventClick(clickInfo);
    }
  };

  // 더보기 클릭 핸들러
  const handleShowMore = (events, date) => {
    console.log("더보기 클릭:", date, events);
    // 해당 날짜의 모든 이벤트를 보여주는 모달이나 팝업을 열 수 있습니다
    // 예시: 날짜 클릭과 같은 동작으로 처리
    if (onDateClick) {
      onDateClick(moment(date).format("YYYY-MM-DD"));
    }
  };

  const handleAddEventClick = () => {
    const today = moment().format("YYYY-MM-DD");
    const clickedEventData = {
      id: null,
      title: "",
      date: today, // 기본값 : 오늘 날짜
      content: "",
      tagName: "",
      is_completed: false,
      deadline: null,
    };

    setModalData(clickedEventData);
    setIsModalOpen(true);
  };

  // 커스텀 툴바 컴포넌트
  const CustomToolbar = ({
    label,
    onNavigate,
    onView,
    view,
  }) => {
    return (
      <div className="flex justify-between items-center my-4 px-4">
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => onNavigate("TODAY")}
            style={{
              marginRight: "10px",
              border: "none",
              backgroundColor: "white",
              color: "#27374D",
              padding: "5px 10px",
              borderRadius: "4px",
              fontSize: "0.9rem",
              fontWeight: "500",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#F0F4F8";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "white";
            }}
          >
            Today
          </button>
        </div>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => onNavigate("PREV")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              marginRight: "15px",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <div className="rbc-toolbar-label">{label}</div>
          <button
            type="button"
            onClick={() => onNavigate("NEXT")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              marginLeft: "15px",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 6L15 12L9 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
        <div className="flex">
          <button
            type="button"
            onClick={handleAddEventClick}
            style={{
              backgroundColor: "white",
              color: "#27374D",
              border: "none",
              borderRadius: "50%",
              width: "24px",
              height: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "10px",
              fontWeight: "bold",
              fontSize: "24px",
              boxShadow: "none",
              transition: "all 0.2s ease",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = "#F0F4F8";
              e.currentTarget.style.color = "#526D82";
              e.currentTarget.style.transform =
                "translateY(-2px)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = "white";
              e.currentTarget.style.color = "#27374D";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            +
          </button>
          {/* <button
            type="button"
            className={view === Views.MONTH ? "rbc-active" : ""}
            onClick={() => onView(Views.MONTH)}
            style={{
              marginRight: "5px",
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid #9DB2BF",
              background:
                view === Views.MONTH ? "#27374D" : "white",
              color: view === Views.MONTH ? "white" : "#27374D",
              fontWeight: view === Views.MONTH ? "600" : "500",
              fontSize: "0.9rem",
              transition: "all 0.2s ease",
            }}
          >
            월간
          </button>
          <button
            type="button"
            className={view === Views.WEEK ? "rbc-active" : ""}
            onClick={() => onView(Views.WEEK)}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              border: "1px solid #9DB2BF",
              background:
                view === Views.WEEK ? "#27374D" : "white",
              color: view === Views.WEEK ? "white" : "#27374D",
              fontWeight: view === Views.WEEK ? "600" : "500",
              fontSize: "0.9rem",
              transition: "all 0.2s ease",
            }}
          >
            주간
          </button> */}
        </div>
      </div>
    );
  };

  // 커스텀 이벤트 스타일링 함수
  const eventStyleGetter = (event) => {
    let style = {
      backgroundColor: event.tagColor || "#526D82",
      borderRadius: "4px",
      opacity: 0.9,
      color: "#fff",
      border: "none",
      display: "block",
      fontSize: "0.85em",
      boxShadow: "0 2px 3px rgba(39, 55, 77, 0.2)",
    };

    // 완료된 이벤트는 다르게 스타일링
    if (event.is_completed) {
      style.backgroundColor = "#9DB2BF";
      style.textDecoration = "line-through";
      style.opacity = 0.7;
    }

    return { style };
  };

  // 날짜 셀 스타일링 함수
  const dayPropGetter = (date) => {
    const today = new Date();
    if (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    ) {
      return {
        className: "rbc-today",
        style: {
          backgroundColor: "rgba(82, 109, 130, 0.15)",
        },
      };
    }
    return {};
  };

  return (
    <div
      style={{
        height: "600px",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 10px 25px rgba(39, 55, 77, 0.08)",
        border: "1px solid #DDE6ED",
        padding: "0",
      }}
    >
      <BigCalendar
        localizer={localizer}
        events={formattedEvents}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        defaultView={Views.MONTH}
        views={[Views.MONTH, Views.WEEK]}
        selectable
        onSelectSlot={handleSlotSelect}
        onSelectEvent={handleEventSelect}
        onShowMore={handleShowMore}
        eventPropGetter={eventStyleGetter}
        dayPropGetter={dayPropGetter}
        components={{
          toolbar: CustomToolbar,
        }}
        messages={{
          today: "오늘",
          previous: "이전",
          next: "다음",
          month: "월간",
          week: "주간",
          day: "일간",
          agenda: "일정",
          date: "날짜",
          time: "시간",
          event: "이벤트",
          noEventsInRange: "이 기간에는 일정이 없습니다.",
          showMore: (total) => `+ ${total}개 더 보기`,
        }}
        style={{
          height: "100%",
          width: "100%",
          backgroundColor: "white",
        }}
      />
    </div>
  );
};

export default Calendar;
