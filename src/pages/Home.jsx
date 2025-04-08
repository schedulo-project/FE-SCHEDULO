import React, { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import CheckSchedule from "../components/CheckSchedule";
import GetCookie from "../lib/GetCookie";
import ScheduleModal from "../components/ScheduleModal";
import fetchSchedules from "../lib/checkScheduleApi";
const Logindata = await GetCookie();

const Home = () => {
  // 임시 데이터
  const [events, setEvents] = useState([]); // 일정조회 api로 불러온 일정 데이터들
  const [selectedDateEvents, setSelectedDateEvents] = useState(
    []
  ); // 선택된 날짜의 데이터
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜 상태 추가
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const today = new Date().toISOString().split("T")[0]; // 오늘 날짜 불러오기

  // 일정 데이터 불러오기(api)
  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const transformedEvents = await fetchSchedules(
          "2025-02-28",
          "2025-05-30"
        );
        console.log("가공한 서버데이터", transformedEvents);
        setEvents(transformedEvents);
      } catch (error) {
        console.error("Error loading schedules", error);
      }
    };
    loadSchedules();
  }, []);

  // 선택된 날짜의 일정 업데이트
  useEffect(() => {
    const dateFilter = selectedDate || today; // 클릭된 날짜가 없으면 오늘 날짜 사용
    const eventsOnDate = events.filter(
      // 오늘(today) or 클릭된 날짜에 해당하는 이벤트 필터링 후 반환
      (event) => event.date === dateFilter
    );
    setSelectedDateEvents(eventsOnDate);
  }, [events, selectedDate, today]);

  // 날짜 클릭 시 선택된 날짜 업데이트
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  // 캘린더 일정 클릭 시 모달 켜기
  const handleEventClick = (clickInfo) => {
    const clickedEvent = clickInfo.event; // clickedEvent : 클릭된 일정의 정보

    // clickedEventData : 클린된 일정의 정보 가공한 데이터
    const clickedEventData = {
      id: clickedEvent.id,
      title: clickedEvent.title,
      date: clickedEvent.startStr,
      content: clickedEvent.extendedProps.content || "",
      tagName: clickedEvent.extendedProps.tagName || "",
      is_completed: clickedEvent.extendedProps.is_completed,
      deadline: clickedEvent.extendedProps.deadline || null,
    };

    setModalData(clickedEventData);
    setIsModalOpen(true);
  };

  const handleCheck = (id) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id
          ? { ...event, is_completed: !event.is_completed }
          : event
      )
    );
  };

  // 일정 상세 페이지에서 일정 수정 시 사용될 함수 - data가 비어 있으면 state에서 지워야함 이건 추가 해야됨
  // onChange로 전달된 삭제된 일정의 ID를 기반으로 events 상태를 업데이트(4/8)
  const handleChange = (data, id) => {
    if (data === null) {
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== id)
      );
      console.log("삭제 후 events", events);
    } else {
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === id
            ? { ...event, ...data } // data에 있는 값들로 덮어씀
            : event
        )
      );
    }
  };

  // FullCalendar에 맞게 이벤트 형식 변환 (3개까지만 표시, 초과 시 "..." 추가)
  const calendarEvents = events
    .filter((event) => !event.is_completed) // 완료되지 않은 일정만 포함
    .reduce((acc, event) => {
      const existingDate = acc.find(
        (item) => item.date === event.date
      );
      if (existingDate) {
        // 이미 해당 날짜가 있는 경우
        if (existingDate.events.length < 3) {
          existingDate.events.push(event);
        } else if (!existingDate.hasMore) {
          existingDate.hasMore = true; // 초과 일정 표시
        }
      } else {
        // 새로운 날짜 추가
        acc.push({
          date: event.date,
          events: [event],
          hasMore: false,
        });
      }
      return acc;
    }, [])
    // FullCalendar에 맞는 이벤트 배열로 변환
    .flatMap((item) => {
      // 날짜별로 일정과 "..." 추가
      const limitedEvents = item.events.map((event) => ({
        id: event.id,
        title: event.title,
        date: event.date,
        tagName: event.tagName,
        is_completed: event.is_completed,
        content: event.content,
        deadline: event.deadline,
      }));

      // "..."을 가장 위에 추가
      if (item.hasMore) {
        limitedEvents.push({
          id: `${item.date}`,
          title: "etc..",
          date: item.date,
          tagName: "",
          is_completed: false,
          content: "",
          deadline: null,
          classname: "event-item-dots",
        });
      }

      return limitedEvents;
    });

  console.log("삭제 전 events", events);
  return (
    <div className="p-6">
      <div className="flex gap-8">
        <div className="w-3/4">
          <Calendar
            events={calendarEvents}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        </div>
        <ScheduleModal
          isModalOpen={isModalOpen}
          data={modalData}
          setIsModalOpen={setIsModalOpen}
          onChange={handleChange}
        />
        <div className="w-100">
          <CheckSchedule
            selectedDateEvents={selectedDateEvents}
            onCheck={handleCheck}
            onChange={handleChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
