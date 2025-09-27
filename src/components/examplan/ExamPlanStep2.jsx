import React, { useState, useEffect, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import baseAxiosInstance from "../../api/baseAxiosApi";
import { getStudyRoutine } from "../../api/studyRoutineApi";
import { useAuth } from "../../contexts/AuthContext";

const ExamPlanStep2 = ({
  formData,
  updateFormData,
  prevStep,
  nextStep,
}) => {
  const { accessToken } = useAuth();
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
  const [isSubjectsLocked, setIsSubjectsLocked] = useState(
    formData.subjects && formData.subjects.length > 0
  ); // 과목 확정 여부
  const [isDetailLocked, setIsDetailLocked] = useState(
    formData.averageSubjectsPerDay > 0
  ); // 상세 설정 확정 여부

  // 공부 습관 API 조회
  const {
    data: studyRoutineData,
    isLoading: studyRoutineLoading,
    error: studyRoutineError,
  } = useQuery({
    queryKey: ["studyRoutine"],
    queryFn: getStudyRoutine,
    enabled: !!accessToken,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  });

  // 크롤링된 시간표 조회
  const {
    data: crawledData,
    isLoading: crawledLoading,
    error: crawledError,
  } = useQuery({
    queryKey: ["crawledTimetable"],
    queryFn: async () => {
      const response = await baseAxiosInstance.get(
        "/users/getTimeTable/",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return response.data;
    },
    enabled: !!accessToken,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  });

  // 직접 등록한 시간표 조회
  const {
    data: manualData = [],
    isLoading: manualLoading,
    error: manualError,
  } = useQuery({
    queryKey: ["manualTimetable"],
    queryFn: async () => {
      const response = await baseAxiosInstance.get(
        "/schedules/timetables/",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return response.data;
    },
    enabled: !!accessToken,
    staleTime: 2 * 60 * 1000,
    cacheTime: 5 * 60 * 1000,
  });

  // 시간표에서 과목 추출 (중복 제거 포함)
  const extractedSubjects = useMemo(() => {
    let uniqueSubjects = [];

    if (crawledData?.courses_data) {
      const crawledSubjects = crawledData.courses_data.map(
        ([courseName]) => courseName
      );
      uniqueSubjects = [...uniqueSubjects, ...crawledSubjects];
    }

    if (manualData && Array.isArray(manualData)) {
      const manualSubjects = manualData.map(
        (item) => item.subject
      );
      uniqueSubjects = [...uniqueSubjects, ...manualSubjects];
    }

    return [...new Set(uniqueSubjects)];
  }, [crawledData, manualData]);

  // formData에 저장된 customSubjects 반영
  const customSubjects = useMemo(() => {
    return formData.customSubjects || [];
  }, [formData.customSubjects]);

  // 최종 과목 목록 설정
  useEffect(() => {
    const finalSubjects = [
      ...extractedSubjects,
      ...customSubjects,
    ];
    const uniqueFinalSubjects = [...new Set(finalSubjects)];

    if (
      JSON.stringify(subjects) !==
      JSON.stringify(uniqueFinalSubjects)
    ) {
      setSubjects(uniqueFinalSubjects);
    }
  }, [extractedSubjects, customSubjects, subjects]);

  // 초기값 설정 (처음 한 번만 실행)
  useEffect(() => {
    if (formData.subjects && formData.subjects.length > 0) {
      setSelectedSubjects(formData.subjects);
    }
    if (
      formData.averageSubjectsPerDay &&
      formData.averageSubjectsPerDay > 0
    ) {
      setAverageSubjectsPerDay(formData.averageSubjectsPerDay);
      setShowDetailSetting(true);
    }
  }, []);

  // 과목 선택/해제
  const toggleSubject = (subject) => {
    const alreadySelected = selectedSubjects.includes(subject);
    const updated = alreadySelected
      ? selectedSubjects.filter((s) => s !== subject)
      : [...selectedSubjects, subject];

    setSelectedSubjects(updated);
  };

  // 직접 과목 추가
  const handleAddCustomSubject = () => {
    if (!customInput.trim()) return;

    const newSubject = customInput.trim();

    if (!subjects.includes(newSubject)) {
      setSubjects((prev) => [...prev, newSubject]);
    }

    if (!selectedSubjects.includes(newSubject)) {
      setSelectedSubjects((prev) => [...prev, newSubject]);
    }

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

  // 과목 저장 -> 상세 설정 단계로 이동
  const handleSaveSubjects = () => {
    if (selectedSubjects.length === 0) {
      alert("최소 1개 이상의 과목을 선택해주세요.");
      return;
    }
    setShowDetailSetting(true);
    setIsSubjectsLocked(true);
  };

  const calculateStudyWeeks = () => {
    if (
      formData.weeksBeforeExam &&
      !isNaN(formData.weeksBeforeExam)
    )
      return parseInt(formData.weeksBeforeExam, 10);

    if (
      studyRoutineData?.weeks_before_exam &&
      !isNaN(studyRoutineData.weeks_before_exam)
    )
      return parseInt(studyRoutineData.weeks_before_exam, 10);

    return 1;
  };

  // 상세 설정 저장
  const handleSaveDetailSetting = () => {
    updateFormData({
      subjects: selectedSubjects,
      averageSubjectsPerDay,
    });
    setIsDetailLocked(true);
    alert("상세 설정이 저장되었습니다.");
  };

  // 다음 단계 이동
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
      studyRoutine: studyRoutineData,
      weeksBeforeExam:
        studyRoutineData?.weeks_before_exam ||
        calculateStudyWeeks(),
      reviewType: studyRoutineData?.review_type,
    });
    nextStep();
  };

  // 로딩 상태
  const isLoading =
    crawledLoading || manualLoading || studyRoutineLoading;

  return (
    <div className="w-full min-h-screen bg-white flex flex-col lg:pl-[11.75rem] relative">
      {/* 제목 */}
      <div className="flex w-full px-4 lg:px-32 pt-16 pb-2">
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
        style={{ marginTop: "-4rem" }}
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
              {/* 로딩 표시 */}
              {isLoading && (
                <div className="text-gray-500">
                  시간표에서 과목을 불러오는 중...
                </div>
              )}

              {/* 과목 목록 */}
              {!isLoading && subjects.length > 0 && (
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
                      onClick={() =>
                        !isSubjectsLocked &&
                        toggleSubject(subject)
                      }
                      className={`w-[200px] lg:w-[250px] min-h-[60px] border px-4 py-3 rounded-lg text-left font-semibold mb-2 ${
                        selectedSubjects.includes(subject)
                          ? "bg-[#D0D7E2] border-[#27374D]"
                          : "bg-white"
                      } ${
                        isSubjectsLocked
                          ? "pointer-events-none opacity-50"
                          : ""
                      }`}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              )}

              {/* 직접 추가 버튼 */}
              {!isLoading &&
                !isAddingCustom &&
                !isSubjectsLocked && (
                  <button
                    className="w-[200px] lg:w-[250px] min-h-[60px] border px-4 py-3 rounded-lg font-semibold text-left mb-2"
                    onClick={() => setIsAddingCustom(true)}
                  >
                    + 직접 추가
                  </button>
                )}

              {/* 직접 추가 입력창 */}
              {isAddingCustom && (
                <div className="relative w-[200px] lg:w-[250px]">
                  <input
                    type="text"
                    disabled={isSubjectsLocked}
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
                    disabled={isSubjectsLocked}
                    onClick={handleAddCustomSubject}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded flex items-center justify-center text-lg font-bold ${
                      isSubjectsLocked
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-[#27374D] text-white hover:bg-[#1e2832]"
                    }`}
                  >
                    +
                  </button>
                </div>
              )}

              {/* 저장 버튼 */}
              {!isSubjectsLocked && (
                <button
                  onClick={handleSaveSubjects}
                  className="w-[80px] h-[32px] bg-[#27374D] text-white rounded-3xl mt-2"
                >
                  저장
                </button>
              )}
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
                  Q. {calculateStudyWeeks()}주 동안 하루 평균 몇
                  과목 공부할 계획인가요?
                </p>
                <div className="flex items-center mt-32 gap-6">
                  <button
                    onClick={() =>
                      !isDetailLocked &&
                      setAverageSubjectsPerDay((prev) =>
                        Math.max(1, prev - 1)
                      )
                    }
                    disabled={isDetailLocked}
                    className={`border p-2 rounded ${
                      isDetailLocked
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    aria-label="이전 단계로 이동"
                  >
                    <Minus size={24} />
                  </button>
                  <span className="text-xl font-bold">
                    {averageSubjectsPerDay}
                  </span>
                  <button
                    onClick={() =>
                      !isDetailLocked &&
                      setAverageSubjectsPerDay(
                        (prev) => prev + 1
                      )
                    }
                    disabled={isDetailLocked}
                    className={`border p-2 rounded ${
                      isDetailLocked
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                    aria-label="다음 단계로 이동"
                  >
                    <Plus size={24} />
                  </button>
                </div>

                {/* 저장 버튼 */}
                {!isDetailLocked && (
                  <button
                    onClick={handleSaveDetailSetting}
                    className="w-[80px] h-[32px] bg-[#27374D] text-white rounded-3xl absolute bottom-0 left-1/2 transform -translate-x-1/2"
                    aria-label="저장"
                  >
                    저장
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamPlanStep2;
