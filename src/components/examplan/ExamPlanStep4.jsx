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
import baseAxiosInstance from "../../api/baseAxiosApi";
import { useAuth } from "../../contexts/AuthContext";

// 일정 생성 함수
const generateStudySchedule = (formData) => {
  const {
    examName,
    startDate,
    endDate,
    subjects,
    averageSubjectsPerDay,
    weeksBeforeExam,
    reviewType,
    studyRoutine,
  } = formData;

  const examStartDate = new Date(startDate);
  const weeksBack =
    weeksBeforeExam || studyRoutine?.weeks_before_exam || 1;
  const studyStartDate = subDays(examStartDate, weeksBack * 7);
  const studyEndDate = subDays(examStartDate, 1);

  // 복습 타입 매핑
  const finalReviewType =
    reviewType || studyRoutine?.review_type || "EVERYDAY";

  // 복습 가능한 요일 결정
  const getValidDays = (reviewType) => {
    switch (reviewType) {
      case "WEEKEND":
        return [0, 6];
      case "WEEKDAY":
        return [1, 2, 3, 4, 5];
      case "EVERYDAY":
        return [0, 1, 2, 3, 4, 5, 6];
      case "SAMEDAY":
        return [0, 1, 2, 3, 4, 5, 6];
      default:
        // 특정 요일 선택된 경우
        if (
          typeof reviewType === "string" &&
          reviewType.includes(" ")
        ) {
          const dayMap = {
            MON: 1,
            TUE: 2,
            WED: 3,
            THU: 4,
            FRI: 5,
            SAT: 6,
            SUN: 0,
          };
          return reviewType
            .split(" ")
            .map((day) => dayMap[day])
            .filter((d) => d !== undefined);
        }
        return [0, 1, 2, 3, 4, 5, 6];
    }
  };

  const validDays = getValidDays(finalReviewType);

  // 복습 가능한 날짜
  const studyDays = [];
  let currentDate = new Date(studyStartDate);
  while (!isAfter(currentDate, studyEndDate)) {
    const dayOfWeek = currentDate.getDay();
    if (validDays.includes(dayOfWeek)) {
      studyDays.push(
        format(new Date(currentDate), "yyyy-MM-dd")
      );
    }
    currentDate = addDays(currentDate, 1);
  }

  if (studyDays.length === 0) {
    console.warn("복습 가능한 날짜가 없습니다!");
    return {
      events: [],
      studyStartDate: format(studyStartDate, "yyyy-MM-dd"),
      studyEndDate: format(studyEndDate, "yyyy-MM-dd"),
      subjectSessions: {},
    };
  }

  // 과목별 세션 수 계산
  const totalStudySessions =
    studyDays.length * averageSubjectsPerDay;
  const subjectSessions = {};
  const baseSessionsPerSubject = Math.floor(
    totalStudySessions / subjects.length
  );
  const remainingSlots =
    totalStudySessions -
    baseSessionsPerSubject * subjects.length;

  subjects.forEach((subject, idx) => {
    subjectSessions[subject] =
      baseSessionsPerSubject + (idx < remainingSlots ? 1 : 0);
  });

  // 날짜별 과목 배치
  const dateToSubjects = {};
  studyDays.forEach((date) => {
    dateToSubjects[date] = [];
  });

  const events = [];
  let eventId = 0;
  let dayIndex = 0;
  let allSessionsPlaced = false;
  const remainingSessions = { ...subjectSessions };

  while (
    !allSessionsPlaced &&
    dayIndex < studyDays.length * 10
  ) {
    const currentDay = studyDays[dayIndex % studyDays.length];

    if (
      dateToSubjects[currentDay].length < averageSubjectsPerDay
    ) {
      const availableSubjects = subjects.filter(
        (subject) => remainingSessions[subject] > 0
      );

      if (availableSubjects.length > 0) {
        // 해당 날짜에 아직 배치되지 않은 과목 우선 배정
        const subjectToPlace =
          availableSubjects.find(
            (subject) =>
              !dateToSubjects[currentDay].includes(subject)
          ) || availableSubjects[0];

        dateToSubjects[currentDay].push(subjectToPlace);
        events.push({
          id: `study-${eventId++}`,
          title: `${subjectToPlace} 공부`,
          date: currentDay,
          content: `${examName} 대비 ${subjectToPlace} 공부`,
        });

        remainingSessions[subjectToPlace]--;
      }
    }

    dayIndex++;

    // 모든 세션이 배치되었는지 확인
    allSessionsPlaced = Object.values(remainingSessions).every(
      (count) => count === 0
    );
  }

  return {
    events,
    studyStartDate: format(studyStartDate, "yyyy-MM-dd"),
    studyEndDate: format(studyEndDate, "yyyy-MM-dd"),
    subjectSessions,
    validDays,
    totalStudyDays: studyDays.length,
  };
};

const ExamPlanStep4 = ({
  formData,
  updateFormData,
  prevStep,
}) => {
  const { accessToken } = useAuth();
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
  }, [formData]);

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
      id: `study-${Date.now()}`,
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

  // 이벤트 카드 렌더링
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

  // 일정 저장
  const handleSave = async () => {
    try {
      // 1️. 기존 태그 조회
      const tagsRes = await baseAxiosInstance.get(
        "/schedules/tags/"
      );
      const existingTags = tagsRes.data;

      const createdSchedules = [];

      for (const event of events) {
        // 일정 단일 생성
        const scheduleRes = await baseAxiosInstance.post(
          "/schedules/",
          {
            title: event.title,
            content: event.content,
            scheduled_date: event.date,
            deadline: event.date,
          }
        );
        const scheduleData = scheduleRes.data;

        // 2️. 수업명만 추출
        const className = event.title.replace(/ 공부$/, "");

        // 3️. 태그 존재 확인
        let tagName = className;
        const foundTag = existingTags.find(
          (t) => t.name === className
        );

        if (!foundTag) {
          // 새 태그 생성
          const newTagRes = await baseAxiosInstance.post(
            "/schedules/tags/",
            {
              name: className,
            }
          );
          existingTags.push(newTagRes.data);
        }

        // 4️. 태그 연결 (id 기반)
        await baseAxiosInstance.put(
          `/schedules/${scheduleData.id}/`,
          {
            ...scheduleData,
            tag: [tagName],
          }
        );

        createdSchedules.push({
          ...scheduleData,
          tag: [tagName],
        });
      }

      // 5️. 폼 데이터 업데이트
      updateFormData({
        ...formData,
        finalSchedule: createdSchedules,
      });
      localStorage.setItem("planSetupCompleted", "true");

      alert("일정이 저장되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("일정 저장 중 오류:", error);
      alert("일정 저장 중 문제가 발생했습니다.");
    }
  };

  return (
    <div className="relative w-full min-h-screen flex items-center justify-center lg:pl-[11.75rem]">
      {/* 이동 버튼 */}
      <button
        type="button"
        onClick={prevStep}
        className="fixed top-1/2 -translate-y-1/2 left-4 lg:left-[calc(11.75rem+1.5rem)] z-50 text-[#27374D]"
      >
        <ChevronLeft size={49} />
      </button>

      <div className="flex max-w-6xl w-full px-4 gap-12">
        {/* 캘린더 */}
        <div className="flex-1 pl-20 lg:pl-8">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            editable={true}
            events={events}
            eventDrop={handleEventDrop}
            eventContent={renderEventContent}
            height={600}
            contentHeight={600}
          />
        </div>

        {/* 저장 버튼 */}
        <div className="flex flex-col justify-end h-[600px] pr-4">
          <button
            onClick={handleSave}
            className="w-[80px] h-[32px] bg-[#27374D] text-white rounded-3xl self-end"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamPlanStep4;
