import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Minus } from "lucide-react";
import {
  format,
  addDays,
  subDays,
  isAfter,
  differenceInDays,
} from "date-fns";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

// 민사고 공부법에 따른 일정 생성 함수
const generateStudySchedule = (formData) => {
  const {
    startDate,
    endDate,
    studyStartDate: rawStudyStartDate,
    subjects,
    averageSubjectsPerDay,
    subjectRatios,
  } = formData;

  const examStartDate = new Date(startDate);
  const studyStartDate = rawStudyStartDate
    ? new Date(rawStudyStartDate)
    : new Date();
  const studyEndDate = subDays(examStartDate, 1); // 시험 하루 전까지

  const totalStudyDays =
    differenceInDays(studyEndDate, studyStartDate) + 1;
  const totalStudySessions =
    totalStudyDays * averageSubjectsPerDay;

  // 과목별 세션 수 계산
  const subjectSessions = {};
  if (subjectRatios && Object.keys(subjectRatios).length > 0) {
    subjects.forEach((subject) => {
      subjectSessions[subject] = Math.round(
        ((subjectRatios[subject] || 0) / 100) *
          totalStudySessions
      );
    });
  } else {
    const baseSessionsPerSubject = Math.floor(
      totalStudySessions / subjects.length
    );
    const remainingSessions =
      totalStudySessions -
      baseSessionsPerSubject * subjects.length;
    subjects.forEach((subject, idx) => {
      subjectSessions[subject] =
        baseSessionsPerSubject +
        (idx < remainingSessions ? 1 : 0);
    });
  }

  // 공부 날짜 목록 생성
  const studyDays = [];
  let currentDate = new Date(studyStartDate);
  while (!isAfter(currentDate, studyEndDate)) {
    studyDays.push(format(new Date(currentDate), "yyyy-MM-dd"));
    currentDate = addDays(currentDate, 1);
  }

  // 날짜별 할당된 과목 수 추적
  const dateToSubjects = {};
  studyDays.forEach((date) => {
    dateToSubjects[date] = [];
  });

  // 일정 생성
  const events = [];
  let eventId = 0;

  subjects.forEach((subject) => {
    const sessionCount = subjectSessions[subject];
    let assigned = 0;
    let index = 0;

    while (
      assigned < sessionCount &&
      index < studyDays.length * 2
    ) {
      const day = studyDays[index % studyDays.length];

      if (dateToSubjects[day].length < averageSubjectsPerDay) {
        dateToSubjects[day].push(subject);
        events.push({
          id: `study-${eventId++}`,
          title: subject,
          date: day,
        });
        assigned++;
      }

      index++;
    }
  });

  return {
    events,
    studyStartDate: format(studyStartDate, "yyyy-MM-dd"),
    studyEndDate: format(studyEndDate, "yyyy-MM-dd"),
    subjectSessions,
  };
};

const ExamPlanStep4 = ({
  formData,
  updateFormData,
  prevStep,
}) => {
  const [events, setEvents] = useState([]);
  const [scheduleInfo, setScheduleInfo] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (
      formData &&
      formData.startDate &&
      formData.endDate &&
      formData.subjects &&
      formData.subjects.length > 0 &&
      formData.averageSubjectsPerDay
    ) {
      const scheduleData = generateStudySchedule(formData);
      setEvents(scheduleData.events);
      setScheduleInfo(scheduleData);
    }
  }, []);

  // 이벤트 삭제
  const handleRemove = (eventId) => {
    setEvents((prevEvents) =>
      prevEvents.filter((event) => event.id !== eventId)
    );
  };

  // 이벤트 복제
  const handleDuplicate = (eventId) => {
    const original = events.find((e) => e.id === eventId);
    if (!original) return;

    const newEvent = {
      ...original,
      id: `study-${Date.now()}`, // 새로운 ID
    };

    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  // 이벤트 드래그앤드랍
  const handleEventDrop = (info) => {
    const updatedEvents = events.map((event) =>
      event.id === info.event.id
        ? {
            ...event,
            date: format(info.event.start, "yyyy-MM-dd"),
          }
        : event
    );
    setEvents(updatedEvents);
  };

  // 이벤트 콘텐츠 렌더 함수
  const renderEventContent = (eventInfo) => {
    return (
      <div className="relative group flex items-center justify-between gap-1 px-1 py-1">
        {/* 삭제 버튼 (왼쪽) */}
        <button
          onClick={() => handleRemove(eventInfo.event.id)}
          className="flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-[#27374D]"
        >
          <Minus
            size={18}
            strokeWidth={2.5}
            className="bg-[#27374D] text-white rounded-md"
          />
        </button>

        {/* 과목명 */}
        <span
          className="text-sm text-center px-1 whitespace-nowrap overflow-hidden text-ellipsis max-w-[100px]"
          title={eventInfo.event.title}
        >
          {eventInfo.event.title}
        </span>

        {/* 복제 버튼 (오른쪽) */}
        <button
          onClick={() => handleDuplicate(eventInfo.event.id)}
          className="flex flex-col items-center opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-[#27374D]"
        >
          <Plus
            size={18}
            strokeWidth={2.5}
            className="bg-[#E3EEF8] text-[#27374D] rounded-md"
          />
        </button>
      </div>
    );
  };

  // 저장 버튼
  const handleSave = () => {
    updateFormData({ ...formData, finalSchedule: events });
    alert("일정이 저장되었습니다.");
    navigate("/");
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center lg:pl-[11.75rem]">
      {/* 이동 버튼 */}
      <button
        type="button"
        onClick={prevStep}
        className="fixed top-1/2 -translate-y-1/2 left-2 lg:left-[calc(11.75rem+1.5rem)] z-50 text-[#27374D]"
      >
        <ChevronLeft size={49} />
      </button>

      <div className="flex items-end max-w-7xl w-full px-4 gap-12 ml-16 lg:ml-0">
        {/* 캘린더 */}
        <div className="flex-1">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            editable={true}
            events={events}
            eventDrop={handleEventDrop}
            eventContent={renderEventContent}
            height={800}
            aspectRatio={1.35}
            contentHeight={800}
          />
        </div>

        {/* 저장 버튼 */}
        <div className="flex items-end">
          <button
            onClick={handleSave}
            className="w-[80px] h-[32px] bg-[#27374D] text-white rounded-3xl"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamPlanStep4;
