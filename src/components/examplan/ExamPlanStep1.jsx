import React, { useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../../styles/daterange.css";
import CalendarIcon from "../../assets/studyplan/calendar.svg";

const ExamPlanStep1 = ({
  formData,
  updateFormData,
  nextStep,
}) => {
  const [localData, setLocalData] = useState({
    examName: formData.examName || "",
    startDate: formData.startDate || "",
    endDate: formData.endDate || "",
  });

  const [range, setRange] = useState([
    {
      startDate: localData.startDate
        ? new Date(localData.startDate)
        : new Date(),
      endDate: localData.endDate
        ? new Date(localData.endDate)
        : new Date(),
      key: "selection",
    },
  ]);

  const [showCalendar, setShowCalendar] = useState(false);
  const isReadonly =
    formData.subjects && formData.subjects.length > 0;

  const handleChange = (e) => {
    if (isReadonly) return;

    const { name, value } = e.target;
    setLocalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (item) => {
    if (isReadonly) return;

    const newStart = item.selection.startDate;
    const newEnd = item.selection.endDate;

    setRange([item.selection]);
    setLocalData((prev) => ({
      ...prev,
      startDate: format(newStart, "yyyy-MM-dd"),
      endDate: format(newEnd, "yyyy-MM-dd"),
    }));
  };

  const handleCalendarToggle = () => {
    if (isReadonly) return; // readonly 상태에서는 캘린더 열 수 없음
    setShowCalendar(!showCalendar);
  };

  const handleNext = () => {
    if (isReadonly) {
      nextStep();
      return;
    }

    if (
      !localData.examName ||
      !localData.startDate ||
      !localData.endDate
    ) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    // 공부 일수 계산: 오늘 ~ 시험 시작일 하루 전까지
    const today = new Date();
    const examStart = new Date(localData.startDate);
    const examEnd = new Date(localData.endDate);

    // 유효성 검사: 공부 시작일 > 시험 시작일
    if (today > examStart) {
      alert("공부 시작일이 시험 시작일보다 늦을 수 없습니다.");
      return;
    }

    const diffTime = examStart.getTime() - today.getTime();
    const studyDays = Math.max(
      Math.ceil(diffTime / (1000 * 60 * 60 * 24)),
      1
    );

    updateFormData({ ...localData, studyDays });
    nextStep();
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col lg:pl-[11.75rem]">
      {/* 제목 */}
      <div className="text-black text-2xl font-medium font-['Inter'] leading-snug pt-16 pb-2 px-4 lg:px-32">
        1. 기본 입력
      </div>

      <div
        className="flex flex-1 items-center justify-center relative px-6"
        style={{ marginTop: "-16rem" }}
      >
        {/* 입력 폼 */}
        <div className="w-full max-w-[700px] flex flex-col justify-center pr-20 lg:pr-24">
          {/* 시험명 */}
          <div className="flex items-center justify-center mb-8">
            <label className="w-32 text-xl font-semibold">
              시험명
            </label>
            <input
              type="text"
              name="examName"
              value={localData.examName}
              onChange={handleChange}
              readOnly={isReadonly}
              className={`w-full p-4 text-lg border border-[#8E92BC] rounded-lg max-w-[400px] focus:outline-none h-14 box-border ${
                isReadonly
                  ? "bg-gray-100 cursor-not-allowed text-gray-600"
                  : "bg-white"
              }`}
            />
          </div>

          {/* 시험기간 */}
          <div className="flex items-center justify-center relative">
            <label className="w-32 text-xl font-semibold">
              시험기간
            </label>
            <div className="flex flex-col gap-2 w-full max-w-[400px] relative">
              <div
                onClick={handleCalendarToggle}
                className={`w-full p-4 text-lg border border-[#8E92BC] rounded-lg flex items-center justify-between h-14 box-border ${
                  isReadonly
                    ? "bg-gray-100 cursor-not-allowed text-gray-600"
                    : "bg-white cursor-pointer"
                }`}
              >
                <div className="text-lg font-normal font-['Inter'] leading-tight">
                  {localData.startDate && localData.endDate
                    ? `${format(
                        new Date(localData.startDate),
                        "M월 d일"
                      )} ~ ${format(
                        new Date(localData.endDate),
                        "M월 d일"
                      )}`
                    : ""}
                </div>
                {/* 캘린더 아이콘 */}
                <img
                  src={CalendarIcon}
                  alt="calendar"
                  className={`w-6 h-6 ${
                    isReadonly ? "opacity-50" : ""
                  }`}
                />
              </div>
              {showCalendar && !isReadonly && (
                <div className="absolute z-10 top-full left-1/2 transform -translate-x-1/2">
                  <DateRange
                    editableDateInputs={true}
                    onChange={handleDateChange}
                    moveRangeOnFirstSelection={false}
                    ranges={range}
                    months={1}
                    direction="horizontal"
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 이동 버튼 */}
        <button
          type="button"
          onClick={handleNext}
          className="fixed top-1/2 -translate-y-1/2 right-2 lg:right-10 z-50 text-[#27374D]"
          aria-label="다음 단계로 이동"
        >
          <ChevronRight size={49} />
        </button>
      </div>
    </div>
  );
};

export default ExamPlanStep1;
