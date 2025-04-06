import React, { useEffect, useState } from "react";
import Calendar from "../components/Calendar";
import EventForm from "../components/EventForm";
import CheckSchedule from "../components/CheckSchedule";
import GetCookie from "../lib/GetCookie";
const Logindata = await GetCookie();

const Home = () => {
  // 임시 데이터
  const [events, setEvents] = useState([]);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null); // 선택된 날짜 상태 추가

  // 날짜 형식 맞추기
  const today = new Date().toISOString().split("T")[0];

  const url =
    "http://13.124.140.60/schedules/list/?first=2025-02-28&last=2025-04-30";

  // 일정 데이터 불러오기(api)
  const fetchSchedules = async () => {
    const token = Logindata.access;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch schedules");
      }

      const data = await response.json();
      console.log("data112241", data);

      // API 응답 데이터를 events 형식으로 변환
      const transformedEvents = Object.entries(
        data.schedules
      ).flatMap(([date, schedules]) =>
        schedules.map((schedule) => ({
          id: schedule.id,
          title: schedule.title || "제목 없음", // 일정의 제목 설정 (없으면 "제목 없음")
          tagName: schedule.tag
            .map((tag) => tag.name)
            .join(", "), // 태그 이름 합치기
          date: date, // 날짜 설정
          is_completed: schedule.is_completed,
          content: schedule.content,
          deadline: schedule.deadline,
        }))
      );

      console.log("transformedEvents", transformedEvents);

      setEvents(transformedEvents);
    } catch (error) {
      console.error("Error fetching schedules", error);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // 선택된 날짜의 일정 업데이트
  useEffect(() => {
    const dateFilter = selectedDate || today; // 선택된 날짜가 없으면 오늘 날짜 사용
    const eventsOnDate = events.filter(
      (event) => event.date === dateFilter
    );
    setSelectedEvents(eventsOnDate);
  }, [events, selectedDate, today]);

  // 날짜 클릭 시 선택된 날짜 업데이트
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  // 새로운 이벤트 추가
  const addEvent = (newEvent) => {
    setEvents([
      ...events,
      { ...newEvent, id: events.length + 1 },
    ]);
  };

  // FullCalendar에 맞게 이벤트 형식 변환
  const calendarEvents = events
    .filter((event) => !event.is_completed)
    .map((event) => ({
      id: event.id,
      title: event.title,
      date: event.date,
      tagName: event.tagName,
      is_completed: event.is_completed,
      content: event.content,
      deadline: event.deadline,
    }));
  console.log("calendarEvents", calendarEvents);

  const handleCheck = (id) => {
    setEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === id
          ? { ...event, is_completed: !event.is_completed }
          : event
      )
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">📅 내 일정</h2>
      <EventForm addEvent={addEvent} />
      <div className="flex gap-8">
        <div className="w-3/4">
          <Calendar
            events={calendarEvents}
            onDateClick={handleDateClick}
          />
        </div>

        <div className="w-100">
          <CheckSchedule
            selectedEvents={selectedEvents}
            onCheck={handleCheck}
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
