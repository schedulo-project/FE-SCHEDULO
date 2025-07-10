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
  nextStep,
  prevStep,
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
    if (timetable) {
      const parsed = JSON.parse(timetable);
      const uniqueSubjects = [
        ...new Set(parsed.map((item) => item.name)),
      ];
      setSubjects(uniqueSubjects);
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
    if (!subjects.includes(customInput)) {
      setSubjects((prev) => [...prev, customInput]);
    }
    if (!selectedSubjects.includes(customInput)) {
      setSelectedSubjects((prev) => [...prev, customInput]);
    }
    setCustomInput("");
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
    alert("상세 설정이 저장되었습니다."); // 저장 확인 알림 (선택사항)
  };

  // 오른쪽 이동 화살표 클릭
  const handleNext = () => {
    if (selectedSubjects.length === 0) {
      alert("최소 1개 이상의 과목을 선택해주세요.");
      return;
    }
    updateFormData({
      subjects: selectedSubjects,
      averageSubjectsPerDay,
    });
    nextStep();
  };

  return (
    <div className="w-full flex min-h-screen">
      {/* 왼쪽: 과목 선택 */}
      <div
        className={`w-1/2 transition-opacity duration-500 ${
          showDetailSetting ? "opacity-30" : "opacity-100"
        }`}
      >
        <div className="text-black text-2xl font-medium font-['Inter'] leading-snug pt-32 pb-2 px-32">
          2. 과목 선택
        </div>
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 relative">
          {subjects.map((subject) => (
            <button
              key={subject}
              className={`w-[250px] min-h-[60px] border px-4 py-3 rounded-lg text-left font-semibold ${
                selectedSubjects.includes(subject)
                  ? "bg-[#D0D7E2] border-[#27374D]"
                  : "bg-white"
              }`}
              onClick={() => toggleSubject(subject)}
            >
              {subject}
            </button>
          ))}

          {/* 직접 추가 버튼 */}
          {!isAddingCustom ? (
            <button
              className="w-[250px] min-h-[60px] border px-4 py-3 font-semibold text-left"
              onClick={() => setIsAddingCustom(true)}
            >
              + 직접 추가
            </button>
          ) : (
            <div className="flex flex-col items-center">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter")
                    handleAddCustomSubject();
                }}
                className="border px-3 py-2 rounded w-[250px] min-h-[60px]"
                placeholder="과목명을 입력하세요"
              />
            </div>
          )}
          <button
            onClick={handleSaveSubjects}
            className="w-[80px] h-[32px] bg-[#27374D] text-white rounded-3xl absolute bottom-0 left-1/2 transform -translate-x-1/2"
          >
            저장
          </button>
        </div>
      </div>

      {/* 오른쪽: 상세 설정 */}
      {showDetailSetting && (
        <div className="w-1/2 px-16 animate-fade-in ">
          <div className="text-black text-2xl font-medium font-['Inter'] leading-snug pt-32 pb-2">
            3. 상세 설정
          </div>
          {/* 가운데 본문 */}
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 relative">
            <p className="text-lg">
              Q. 3주 동안 하루 평균 몇 과목 공부할 계획인가요?
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
                  setAverageSubjectsPerDay((prev) => prev + 1)
                }
                className="border p-2 rounded"
              >
                <Plus size={24} />
              </button>
            </div>

            {showDetailSetting && (
              <button
                onClick={handleSaveDetailSetting}
                className="w-[80px] h-[32px] bg-[#27374D] text-white rounded-3xl absolute bottom-0 left-1/2 transform -translate-x-1/2"
              >
                저장
              </button>
            )}
          </div>
        </div>
      )}

      {/* 이동 버튼 */}
      <button
        type="button"
        onClick={prevStep}
        className="absolute left-10 top-1/2 -translate-y-1/2"
      >
        <ChevronLeft size={49} />
      </button>
      <button
        type="button"
        onClick={handleNext}
        className="absolute right-10 top-1/2 -translate-y-1/2"
      >
        <ChevronRight size={49} />
      </button>
    </div>
  );
};

export default ExamPlanStep2;
