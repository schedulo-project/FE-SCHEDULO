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

moment.locale("ko");
const localizer = momentLocalizer(moment);

const Calendar = ({ events, onDateClick, onEventClick }) => {
  const [, setIsModalOpen] = useAtom(isModalOpenAtom);
  const [modalData, setModalData] = useAtom(modalDataAtom); // 모달에 보여줄 데이터

  const formattedEvents =
    events?.map((event) => {
      const eventDate = event.date || event.start;
      const dateParts = eventDate.split("T")[0].split("-");
      const year = parseInt(dateParts[0], 10);
      const month = parseInt(dateParts[1], 10) - 1; // 월은 0부터 시작
      const day = parseInt(dateParts[2], 10);

      const startDate = new Date(year, month, day);
      let endDate;
      let allDay = true; // 모든 이벤트를 종일 이벤트로 처리

      if (event.deadline) {
        const deadlineParts = event.deadline
          .split("T")[0]
          .split("-");
        const dlYear = parseInt(deadlineParts[0], 10);
        const dlMonth = parseInt(deadlineParts[1], 10) - 1; // 월은 0부터 시작
        const dlDay = parseInt(deadlineParts[2], 10);

        endDate = new Date(dlYear, dlMonth, dlDay);
        const nextDay = new Date(endDate);
        nextDay.setDate(nextDay.getDate() + 1);
        endDate = nextDay;
      } else {
        endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        endDate.setHours(0, 0, 0, 0);
      }

      // 디버깅을 위한 로그
      console.log(`이벤트 [${event.title}] 날짜 설정:`, {
        원본날짜: eventDate,
        시작일: startDate.toISOString().split("T")[0],
        종료일: endDate.toISOString().split("T")[0],
        데드라인: event.deadline,
        종일여부: allDay,
      });

      return {
        ...event,
        start: startDate,
        end: endDate,
        title: event.title,
        allDay: allDay, // 종일 이벤트로 설정
        resource: event, // 원본 이벤트 데이터를 resource에 저장
      };
    }) || [];

  const handleSlotSelect = ({ start, end }) => {
    if (onDateClick) {
      onDateClick(moment(start).format("YYYY-MM-DD"));
    }
  };

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

  const handleShowMore = (events, date) => {
    console.log("더보기 클릭:", date, events);
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
          <button
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
          </button>
        </div>
      </div>
    );
  };

  // 커스텀 이벤트 스타일링 함수
  const eventStyleGetter = (event) => {
    // 기본 스타일 설정
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

    // 하루짜리 이벤트인지 확인 (deadline이 없거나 시작일과 같을 때)
    const isSingleDayEvent =
      !event.deadline || event.date === event.deadline;

    if (isSingleDayEvent) {
      // 하루짜리 이벤트는 좀 더 명확한 스타일링
      style.borderRadius = "8px";
      style.margin = "0 2px";
      style.fontWeight = "500";
      // 하루짜리 이벤트를 명확히 구분하기 위한 추가 스타일
      style.width = "calc(100% - 4px)";
    }

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
        length={7} // 이벤트 표시 길이 제한
        popup={true} // 팝업 활성화
        // 주간 보기에서 시간을 완전히 숨기고 일정만 표시하기 위한 설정
        step={1440} // 하루 단위로 표시 (24시간 = 1440분)
        timeslots={1} // 시간 슬롯 수를 1개로 설정
        showMultiDayTimes={false} // 여러 날에 걸친 시간 이벤트를 표시하지 않음
        min={new Date(0, 0, 0, 0, 0, 0)} // 최소 시간 (0시)
        max={new Date(0, 0, 0, 0, 0, 0)} // 최대 시간도 0시로 설정하여 시간 슬롯 영역 최소화
        defaultAllDay={true} // 모든 이벤트를 종일 이벤트로 처리
        components={{
          toolbar: CustomToolbar,
          // 주간 뷰에서도 종일 이벤트처럼 표시하기 위한 커스텀 컴포넌트
          timeGutterHeader: () => null, // 시간 헤더 숨기기
          timeGutterWrapper: () => null, // 시간 열 숨기기
          timeSlotWrapper: ({ children }) => children, // 시간 슬롯 간소화
          week: {
            // 주간 뷰 커스터마이징
            header: ({ date }) => (
              <span style={{ fontWeight: "600" }}>
                {moment(date).format("ddd")}
              </span>
            ),
          },
        }}
        // 주간 보기에서 시간 숨기기 위한 설정
        formats={{
          timeGutterFormat: () => "", // 시간 포맷을 빈 문자열로 설정
          dayFormat: "ddd", // 요일만 표시
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
