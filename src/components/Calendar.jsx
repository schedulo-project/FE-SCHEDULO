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

  // 커스텀 툴바 컴포넌트
  const CustomToolbar = ({
    label,
    onNavigate,
    onView,
    view,
  }) => {
    return (
      <div className="rbc-toolbar">
        <div className="rbc-btn-group">
          <button
            type="button"
            onClick={() => onNavigate("PREV")}
          >
            이전
          </button>
          <button
            type="button"
            onClick={() => onNavigate("NEXT")}
          >
            다음
          </button>
        </div>
        <div className="rbc-toolbar-label">{label}</div>
        <div className="rbc-btn-group">
          <button
            type="button"
            onClick={handleAddEventClick}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "6px 12px",
              marginRight: "8px",
            }}
          >
            +
          </button>
          <button
            type="button"
            className={view === Views.MONTH ? "rbc-active" : ""}
            onClick={() => onView(Views.MONTH)}
          >
            월간
          </button>
          <button
            type="button"
            className={view === Views.WEEK ? "rbc-active" : ""}
            onClick={() => onView(Views.WEEK)}
          >
            주간
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ height: "600px" }}>
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
          noEventsInRange: "이 기간에는 이벤트가 없습니다.",
          showMore: (total) => `+ ${total}개 더 보기`,
        }}
        style={{ height: "100%" }}
      />
    </div>
  );
};

export default Calendar;
