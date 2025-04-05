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

  // 날짜 형식 맞추기
  const today = (() => {
    const date = new Date();
    date.setDate(date.getDate() + 1); // 하루 더하기
    return date.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환
  })();

  const url =
    "http://13.124.140.60/schedules/list/?first=2025-02-28&last=2025-04-30";

  // 일정 데이터 불러오기(api)
  const fetchSchedules = async () => {
    const token = Logindata.token;

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
          checklist: [], // checklist는 API 응답에 없으므로 빈 배열로 설정
        }))
      );

      setEvents(transformedEvents);
    } catch (error) {
      console.error("Error fetching schedules", error);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  // 컴포넌트가 처음 렌더링될 때 오늘 날짜의 이벤트를 설정
  useEffect(() => {
    const eventsOnToday = events.filter(
      (event) => event.date === today
    );
    setSelectedEvents(eventsOnToday);
  }, [events, today]);

  // 날짜 클릭 시 해당 날짜의 일정 띄우기
  const handleDateClick = (date) => {
    const eventsOnDate = events.filter(
      (event) => event.date === date
    );
    setSelectedEvents(eventsOnDate);
  };

  // 새로운 이벤트 추가
  const addEvent = (newEvent) => {
    setEvents([
      ...events,
      { ...newEvent, id: events.length + 1 },
    ]);
  };

  // FullCalendar에 맞게 이벤트 형식 변환
  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: event.title,
    date: event.date,
    tagName: event.tagName,
  }));

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
          <CheckSchedule selectedEvents={selectedEvents} />
        </div>
      </div>
    </div>
  );
};

export default Home;
