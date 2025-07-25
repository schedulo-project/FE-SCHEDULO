import React, { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react";

const ExamPlanStep2 = ({
  formData,
  updateFormData,
  prevStep,
  nextStep,
}) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState(
    formData.subjects || []
  );
  const [averageSubjectsPerDay, setAverageSubjectsPerDay] =
    useState(formData.averageSubjectsPerDay || 1);
  const [showDetailSetting, setShowDetailSetting] =
    useState(false);
  const [isAddingCustom, setIsAddingCustom] = useState(false); // 직접 추가
  const [customInput, setCustomInput] = useState("");

  // 로컬스토리지에서 시간표 가져오기
  useEffect(() => {
    const timetable = localStorage.getItem("schedule");
    let uniqueSubjects = [];

    if (timetable) {
      try {
        const parsed = JSON.parse(timetable);
        uniqueSubjects = [
          ...new Set(parsed.map((item) => item.name)),
        ];
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
      }
    } else {
      console.log("No schedule found in localStorage");
    }

    if (formData.customSubjects) {
      uniqueSubjects = [
        ...uniqueSubjects,
        ...formData.customSubjects,
      ];
    }

    setSubjects(uniqueSubjects);
  }, [formData.customSubjects]);

  useEffect(() => {
    if (formData.subjects) {
      setSelectedSubjects(formData.subjects);
    }
    if (formData.averageSubjectsPerDay) {
      setAverageSubjectsPerDay(formData.averageSubjectsPerDay);
      setShowDetailSetting(true); // 이미 저장된 상세 설정이 있으면 표시
    }
  }, []);

  // 과목 선택/해제 토글
  const toggleSubject = (subject) => {
    const alreadySelected = selectedSubjects.includes(subject);
    const updated = alreadySelected
      ? selectedSubjects.filter((s) => s !== subject)
      : [...selectedSubjects, subject];

    setSelectedSubjects(updated);
  };

  // 직접 추가 과목 처리
  const handleAddCustomSubject = () => {
    if (!customInput.trim()) return;

    const newSubject = customInput.trim();

    // subjects 배열에 추가
    if (!subjects.includes(newSubject)) {
      setSubjects((prev) => [...prev, newSubject]);
    }

    // selectedSubjects에 추가
    if (!selectedSubjects.includes(newSubject)) {
      setSelectedSubjects((prev) => [...prev, newSubject]);
    }

    // formData에 직접 추가한 과목들 저장
    const currentCustomSubjects = formData.customSubjects || [];
    if (!currentCustomSubjects.includes(newSubject)) {
      updateFormData({
        ...formData,
        customSubjects: [...currentCustomSubjects, newSubject],
      });
    }

    setCustomInput("");
    setIsAddingCustom(false);
  };

  // 왼쪽 저장 버튼
  const handleSaveSubjects = () => {
    if (selectedSubjects.length === 0) {
      alert("최소 1개 이상의 과목을 선택해주세요.");
      return;
    }
    setShowDetailSetting(true);
  };

  // 오른쪽 저장 버튼
  const handleSaveDetailSetting = () => {
    updateFormData({
      subjects: selectedSubjects,
      averageSubjectsPerDay,
    });
    alert("상세 설정이 저장되었습니다.");
  };

  // 오른쪽 이동 화살표 클릭
  const handleNext = () => {
    if (selectedSubjects.length === 0) {
      alert("최소 1개 이상의 과목을 선택해주세요.");
      return;
    }

    if (!showDetailSetting) {
      alert("과목 저장 후 상세 설정을 완료해주세요.");
      return;
    }

    if (!averageSubjectsPerDay || averageSubjectsPerDay < 1) {
      alert("상세 설정을 저장해주세요.");
      return;
    }

    updateFormData({
      subjects: selectedSubjects,
      averageSubjectsPerDay,
    });
    nextStep();
  };

  return (
    <div className="w-full min-h-screen bg-white flex flex-col lg:pl-[11.75rem] relative">
      {/* 제목 */}
      <div className="flex w-full px-4 lg:px-32 pt-32 pb-2">
        <div className="w-1/2">
          <div className="text-black text-2xl font-medium font-['Inter'] leading-snug">
            2. 과목 선택
          </div>
        </div>

        {showDetailSetting && (
          <div className="w-1/2">
            <div className="text-black text-2xl font-medium font-['Inter'] leading-snug pl-32">
              3. 상세 설정
            </div>
          </div>
        )}
      </div>

      {/* 본문 영역 */}
      <div
        className="relative flex flex-1 items-center px-6"
        style={{ marginTop: "-16rem" }}
      >
        {/* 이동 버튼 */}
        <button
          type="button"
          onClick={prevStep}
          className="fixed top-1/2 -translate-y-1/2 left-2 lg:left-[calc(11.75rem+1.5rem)] z-50 text-[#27374D]"
        >
          <ChevronLeft size={49} />
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="fixed top-1/2 -translate-y-1/2 right-2 lg:right-10 z-50 text-[#27374D]"
        >
          <ChevronRight size={49} />
        </button>

        <div className="flex w-full items-start justify-between">
          {/* 왼쪽: 과목 선택 */}
          <div
            className={`w-1/2 transition-opacity duration-500 ${
              showDetailSetting ? "opacity-30" : "opacity-100"
            }`}
          >
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 relative">
              {/* 과목 목록 */}
              <div
                className="flex flex-col items-center w-full max-h-[45vh] overflow-y-auto"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                <div
                  style={{
                    display: "none",
                  }}
                >
                  ::-webkit-scrollbar
                </div>

                {subjects.map((subject) => (
                  <button
                    key={subject}
                    className={`w-[200px] lg:w-[250px] min-h-[60px] border px-4 py-3 rounded-lg text-left font-semibold mb-2 ${
                      selectedSubjects.includes(subject)
                        ? "bg-[#D0D7E2] border-[#27374D]"
                        : "bg-white"
                    }`}
                    onClick={() => toggleSubject(subject)}
                  >
                    {subject}
                  </button>
                ))}
              </div>

              {/* 직접 추가 버튼 */}
              {!isAddingCustom ? (
                <button
                  className="w-[200px] lg:w-[250px] min-h-[60px] border px-4 py-3 rounded-lg font-semibold text-left mb-2"
                  onClick={() => setIsAddingCustom(true)}
                >
                  + 직접 추가
                </button>
              ) : (
                <div className="relative w-[200px] lg:w-[250px]">
                  <input
                    type="text"
                    value={customInput}
                    onChange={(e) =>
                      setCustomInput(e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (
                        e.key === "Enter" &&
                        !e.nativeEvent.isComposing
                      ) {
                        e.preventDefault();
                        handleAddCustomSubject();
                      }
                      // ESC 키로 취소
                      if (e.key === "Escape") {
                        setCustomInput("");
                        setIsAddingCustom(false);
                      }
                    }}
                    className="border px-3 py-2 rounded w-full min-h-[60px]"
                    placeholder="과목명을 입력하세요"
                    autoFocus
                  />
                  <button
                    onClick={handleAddCustomSubject}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 bg-[#27374D] text-white rounded flex items-center justify-center text-lg font-bold hover:bg-[#1e2832]"
                  >
                    +
                  </button>
                </div>
              )}

              {/* 저장 버튼 */}
              <button
                onClick={handleSaveSubjects}
                className="w-[80px] h-[32px] bg-[#27374D] text-white rounded-3xl absolute bottom-0 left-1/2 transform -translate-x-1/2"
              >
                저장
              </button>
            </div>
          </div>

          {/* 오른쪽: 상세 설정 */}
          <div
            className={`w-1/2 ${
              showDetailSetting
                ? "px-4 lg:px-16 animate-fade-in"
                : "invisible"
            }`}
          >
            {showDetailSetting && (
              <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 relative">
                {/* 본문 영역 */}
                <p className="text-lg text-center">
                  Q. {formData.studyDays}일 동안 하루 평균 몇
                  과목 공부할 계획인가요?
                </p>
                <div className="flex items-center mt-32 gap-6">
                  <button
                    onClick={() =>
                      setAverageSubjectsPerDay((prev) =>
                        Math.max(1, prev - 1)
                      )
                    }
                    className="border p-2 rounded"
                  >
                    <Minus size={24} />
                  </button>
                  <span className="text-xl font-bold">
                    {averageSubjectsPerDay}
                  </span>
                  <button
                    onClick={() =>
                      setAverageSubjectsPerDay(
                        (prev) => prev + 1
                      )
                    }
                    className="border p-2 rounded"
                  >
                    <Plus size={24} />
                  </button>
                </div>
                <button
                  onClick={handleSaveDetailSetting}
                  className="w-[80px] h-[32px] bg-[#27374D] text-white rounded-3xl absolute bottom-0 left-1/2 transform -translate-x-1/2"
                >
                  저장
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPlanStep2;
