import { useState, useEffect } from "react";
import { ChevronRight } from "lucide-react";
import logoImage from "../../assets/logo/logoimage.svg";

const StudyPlanStep2 = ({
  nextStep,
  updateFormData,
  formData = {},
  handleClose,
  onFinalSubmit,
}) => {
  const reviewTypes = ["특정 요일에 복습", "특정 루틴으로 복습"];

  const weekdays = [
    { label: "월", value: "MON" },
    { label: "화", value: "TUE" },
    { label: "수", value: "WED" },
    { label: "목", value: "THU" },
    { label: "금", value: "FRI" },
    { label: "토", value: "SAT" },
    { label: "일", value: "SUN" },
  ];

  const routines = [
    { label: "매일 복습", value: "EVERYDAY" },
    { label: "평일 복습", value: "WEEKDAY" },
    { label: "주말 복습", value: "WEEKEND" },
    { label: "수업 당일 복습", value: "SAMEDAY" },
  ];

  const [selectedType, setSelectedType] = useState(
    formData.reviewType || ""
  );
  const [selectedWeekdays, setSelectedWeekdays] = useState(
    formData.selectedWeekdays || []
  );
  const [selectedRoutine, setSelectedRoutine] = useState(
    formData.selectedRoutine || ""
  );
  useEffect(() => {
    setSelectedType(formData.reviewType || "");
    setSelectedWeekdays(formData.selectedWeekdays || []);
    setSelectedRoutine(formData.selectedRoutine || "");
  }, [
    formData.reviewType,
    formData.selectedWeekdays,
    formData.selectedRoutine,
  ]);

  // 복습 방식(요일 or 루틴) 선택
  const handleTypeSelect = (type) => {
    setSelectedType(type);
    if (type === "특정 요일에 복습") {
      setSelectedRoutine("");
    } else {
      setSelectedWeekdays([]);
    }
  };

  // 요일 선택/해제
  const handleWeekdayToggle = (weekdayValue) => {
    setSelectedWeekdays((prev) => {
      if (prev.includes(weekdayValue)) {
        return prev.filter((day) => day !== weekdayValue);
      } else {
        return [...prev, weekdayValue];
      }
    });
  };

  // 루틴 선택
  const handleRoutineSelect = (routineValue) => {
    setSelectedRoutine(routineValue);
  };

  const handleNext = async () => {
    if (!selectedType) {
      alert("복습 방식을 선택해주세요.");
      return;
    }

    let reviewTypeForAPI = "";
    let formDataUpdate = {};

    if (selectedType === "특정 요일에 복습") {
      if (selectedWeekdays.length === 0) {
        alert("복습할 요일을 하나 이상 선택해주세요.");
        return;
      }

      // 요일 선택 시 데이터 구조
      const weekdaysString = selectedWeekdays.join(" ");
      reviewTypeForAPI = weekdaysString; // API 전송용

      formDataUpdate = {
        reviewType: selectedType,
        selectedWeekdays: selectedWeekdays,
        weekdaysString: weekdaysString,
        reviewTiming: `특정 요일 (${selectedWeekdays
          .map(
            (day) => weekdays.find((w) => w.value === day)?.label
          )
          .join(", ")})`,
        reviewTimingStructured: {
          type: "weekdays",
          weekdays: selectedWeekdays,
          weekdaysString: weekdaysString,
        },
      };
    } else {
      if (!selectedRoutine) {
        alert("복습 루틴을 선택해주세요.");
        return;
      }

      // 루틴 선택 시 데이터 구조
      reviewTypeForAPI = selectedRoutine; // API 전송용
      const routineLabel = routines.find(
        (r) => r.value === selectedRoutine
      )?.label;

      formDataUpdate = {
        reviewType: selectedType,
        selectedRoutine: selectedRoutine,
        reviewTiming: routineLabel,
        reviewTimingStructured: {
          type: "routine",
          routine: selectedRoutine,
        },
      };
    }

    updateFormData(formDataUpdate);

    if (onFinalSubmit) {
      console.log("전송할 review_type:", reviewTypeForAPI);
      await onFinalSubmit(reviewTypeForAPI);
    }
  };

  return (
    <div className="w-full h-full bg-[#DDE6ED] flex flex-col items-center">
      {/* 로고 */}
      <div className="w-full my-16 pl-64 flex justify-start items-center">
        <img
          src={logoImage}
          alt="logo"
          className="w-[250px]"
        />
      
      </div>

      {/* 모달 박스 */}
      <div className="flex items-center justify-center">
        <div className="w-[850px] h-[450px] bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* 헤더 */}
          <div className="bg-[#27374D] h-[100px] py-8 px-8 flex justify-between items-center">
            <span className="text-white text-2xl font-semibold mx-auto">
              공부 습관 등록
            </span>
            <button
              className="text-white text-2xl font-bold hover:opacity-70 transition-opacity"
              onClick={handleClose}
            >
              ✕
            </button>
          </div>
          {/* 본문 */}
          <div className="px-8 py-12 relative h-[calc(100%-110px)]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-8 w-full max-w-2xl">
              <p className="text-center text-gray-700 text-xl">
                2. 복습은 언제 하시나요?
              </p>

              <div className="relative">
                {/* 복습 방식 선택 */}
                <div className="flex justify-center gap-4 mb-6">
                  {reviewTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => handleTypeSelect(type)}
                      className={`px-6 py-3 rounded-full border-2 transition-colors text-base
                        ${
                          selectedType === type
                            ? "bg-[#9DB2BF] text-white border-[#9DB2BF]"
                            : "bg-white text-gray-700 border-gray-300 hover:border-[#9DB2BF]"
                        }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* 특정 요일 선택 */}
                {selectedType === "특정 요일에 복습" && (
                  <div className="flex flex-col items-center space-y-4">
                    <p className="text-gray-600 text-sm">
                      복습할 요일을 선택하세요 (복수 선택 가능)
                    </p>
                    <div className="flex justify-center gap-3 max-w-lg">
                      {weekdays.map((weekday) => (
                        <button
                          key={weekday.value}
                          onClick={() =>
                            handleWeekdayToggle(weekday.value)
                          }
                          className={`w-12 h-12 rounded-full border-2 transition-colors text-sm font-medium
                            ${
                              selectedWeekdays.includes(
                                weekday.value
                              )
                                ? "bg-[#9DB2BF] text-white border-[#9DB2BF]"
                                : "bg-white text-gray-700 border-gray-300 hover:border-[#9DB2BF]"
                            }`}
                        >
                          {weekday.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 특정 루틴 선택 */}
                {selectedType === "특정 루틴으로 복습" && (
                  <div className="flex flex-col items-center space-y-4">
                    <p className="text-gray-600 text-sm">
                      복습 루틴을 선택하세요
                    </p>
                    <div className="flex justify-center gap-3 max-w-lg">
                      {routines.map((routine) => (
                        <button
                          key={routine.value}
                          onClick={() =>
                            handleRoutineSelect(routine.value)
                          }
                          className={`px-5 py-3 rounded-full border-2 transition-colors text-sm
                            ${
                              selectedRoutine === routine.value
                                ? "bg-[#9DB2BF] text-white border-[#9DB2BF]"
                                : "bg-white text-gray-700 border-gray-300 hover:border-[#9DB2BF]"
                            }`}
                        >
                          {routine.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 다음 버튼 */}
                <button
                  onClick={handleNext}
                  className="absolute top-1/2 -translate-y-1/2 right-[-110px] bg-[#9DB2BF] text-white rounded-full w-[48px] h-[48px] flex items-center justify-center hover:bg-[#8BA3B0] transition-colors shadow-md"
                >
                  <ChevronRight size={24} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyPlanStep2;
