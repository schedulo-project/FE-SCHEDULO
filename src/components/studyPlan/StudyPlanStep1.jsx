import React, { useState } from "react";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "../../styles/daterange.css";

export default function StudyPlanStep1({ formData, updateFormData, nextStep }) {
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
      endDate: localData.endDate ? new Date(localData.endDate) : new Date(),
      key: "selection",
    },
  ]);

  const [showCalendar, setShowCalendar] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (item) => {
    const newStart = item.selection.startDate;
    const newEnd = item.selection.endDate;

    setRange([item.selection]);
    setLocalData((prev) => ({
      ...prev,
      startDate: format(newStart, "yyyy-MM-dd"),
      endDate: format(newEnd, "yyyy-MM-dd"),
    }));
  };

  const handleNext = () => {
    if (!localData.examName || !localData.startDate || !localData.endDate) {
      alert("모든 항목을 입력해주세요.");
      return;
    }
    updateFormData(localData);
    nextStep();
  };

  return (
    <div className="w-full h-screen bg-white flex flex-col">
      {/* 제목 */}
      <div className="p-16 pb-0">
        <h2 className="text-2xl font-bold">1. 기본 입력</h2>
      </div>

      <div className="flex flex-grow items-center justify-center relative px-16">
        {/* 이전 버튼 */}
        <button
          type="button"
          className="text-gray-300 cursor-not-allowed absolute left-16"
          disabled
        >
          <ChevronLeft size={49} />
        </button>

        {/* 입력 폼 */}
        <div className="w-full max-w-[700px] mx-auto">
          {/* 시험명 */}
          <div className="flex items-center justify-center mb-8">
            <label className="w-32 text-[20px] font-semibold">
              시험명
            </label>
            <input
              type="text"
              name="examName"
              value={localData.examName}
              onChange={handleChange}
              className="w-full p-4 border border-[#8E92BC] rounded-lg max-w-[400px] focus:outline-none"
              placeholder="ex) 공학설계입문"
            />
          </div>

          {/* 시험기간 */}
          <div className="flex items-center justify-center mb-12 relative">
            <label className="w-32 text-[20px] font-semibold mt-3">
              시험기간
            </label>
            <div className="flex flex-col gap-2 w-full max-w-[400px] relative">
              <input
                readOnly
                onClick={() => setShowCalendar(!showCalendar)}
                value={
                  localData.startDate && localData.endDate
                    ? `${format(
                        new Date(localData.startDate),
                        "M월 d일"
                      )} ~ ${format(new Date(localData.endDate), "M월 d일")}`
                    : ""
                }
                className="w-full p-4 border border-[#8E92BC] rounded-lg cursor-pointer bg-white focus:outline-none"
                placeholder="날짜를 선택해주세요"
              />
              {showCalendar && (
                <div className="absolute z-10 top-full mt-4 left-1/2 transform -translate-x-1/2">
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

        {/* 다음 버튼 */}
        <button
          type="button"
          onClick={handleNext}
          className="text-[#27374D] absolute right-16"
        >
          <ChevronRight size={49} />
        </button>
      </div>
    </div>
  );
}
