import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ExamPlanStep3 = ({
  formData,
  updateFormData,
  prevStep,
  nextStep,
}) => {
  const [ratios, setRatios] = useState({});
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (formData.subjects && formData.subjects.length > 0) {
      const initialRatios = {};
      const subjectCount = formData.subjects.length;
      const equalRatio = Math.floor(100 / subjectCount); // 균등 분배
      const remainder = 100 - equalRatio * subjectCount; // 나머지

      formData.subjects.forEach((subject, index) => {
        initialRatios[subject] =
          formData.subjectRatios?.[subject] ??
          (index === 0 ? equalRatio + remainder : equalRatio);
      });
      setRatios(initialRatios);
    }

    if (formData.isSubjectRatiosSaved) {
      setIsSaved(true);
    }
  }, [formData.subjects, formData.subjectRatios, formData.isSubjectRatiosSaved]);

  const handleRatioChange = (subject, value) => {
    setRatios((prev) => ({
      ...prev,
      [subject]: Number(value),
    }));
    setIsSaved(false);
  };

  const validateAndSaveRatios = () => {
    const total = Object.values(ratios).reduce(
      (a, b) => a + b,
      0
    );
    if (total !== 100) {
      alert(`총 비율 합이 100이 아닙니다. 현재 합: ${total}%`);
      return false;
    }

    updateFormData({ subjectRatios: ratios });
    return true;
  };

  const handleNext = () => {
    if (!isSaved) {
      alert("비율 설정을 저장해주세요.");
      return;
    }
    nextStep();
  };

  const handleSaveRatioSetting = () => {
    if (validateAndSaveRatios()) {
      alert("비율 설정이 저장되었습니다.");
      updateFormData({
        subjectRatios: ratios,
        isSubjectRatiosSaved: true, 
      });
      setIsSaved(true);
    }
  };

  return (
    <div className="relative w-full min-h-screen flex flex-col lg:pl-[11.75rem]">
      {/* 제목 */}
      <div className="text-black text-2xl font-medium font-['Inter'] leading-snug pt-16 pb-2 px-4 lg:px-32">
        4. 비율 설정
      </div>
      <div
        className="flex flex-1 items-center justify-center relative px-[70px]"
        style={{ marginTop: "-16rem" }}
      >
        <div className="w-full max-w-4xl mx-16 flex flex-col min-h-[60vh] justify-between relative">
          <div className="flex-1 flex flex-col justify-center space-y-8">
            {formData.subjects?.map((subject) => (
              <div
                key={subject}
                className="flex items-center justify-between gap-8"
              >
                {/* 과목명 */}
                <span className="w-[350px] max-w-[350px] font-semibold">
                  {subject}
                </span>

                {/* 슬라이더 영역 */}
                <div className="relative w-full h-4 flex items-center">
                  {/* 점들 */}
                  <div className="absolute inset-0 flex justify-between items-center px-1 pointer-events-none z-20">
                    {[...Array(6)].map((_, i) => {
                      const position = (i / 5) * 100; // 0, 20, 40, 60, 80, 100%
                      const isFilled =
                        position < (ratios[subject] || 0);

                      return (
                        <div
                          key={i}
                          className="w-1 h-1 rounded-full transition-colors opacity-40"
                          style={{
                            backgroundColor: isFilled
                              ? "#9DB2BF"
                              : "#27374D",
                          }}
                        />
                      );
                    })}
                  </div>
                  {/* 슬라이더 */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    disabled={isSaved}
                    value={ratios[subject] || 0}
                    onChange={(e) =>
                      handleRatioChange(subject, e.target.value)
                    }
                    className="w-full accent-transparent appearance-none bg-[#9DB2BF] h-4 rounded-full relative z-10"
                    style={{
                      background: `linear-gradient(to right, #27374D 0%, #27374D ${
                        ratios[subject] || 0
                      }%, #9DB2BF ${
                        ratios[subject] || 0
                      }%, #9DB2BF 100%)`,
                    }}
                  />
                  {/* 그림자 원 */}
                  <div
                    className="absolute top-1/2 w-10 h-10 rounded-full transform -translate-y-1/2 pointer-events-none z-15"
                    style={{
                      left: `${ratios[subject] || 0}%`,
                      transform: "translate(-50%, -50%)",
                      backgroundColor:
                        "rgba(189, 189, 189, 0.4)",
                    }}
                  />
                  {/* 슬라이더 핸들 */}
                  <div
                    className="absolute top-1/2 w-6 h-6 rounded-full transform -translate-y-1/2 pointer-events-none z-20"
                    style={{
                      left: `${ratios[subject] || 0}%`,
                      transform: "translate(-50%, -50%)",
                      backgroundColor: "#27374D",
                    }}
                  />
                </div>

                {/* 퍼센트 표시 */}
                <span className="w-[40px] text-right text-sm text-gray-600">
                  {ratios[subject] || 0}%
                </span>
              </div>
            ))}
          </div>

          {/* 저장 버튼 */}
          {!isSaved && (
            <div className="flex justify-center">
              <button
                onClick={handleSaveRatioSetting}
                className="w-[80px] h-[32px] bg-[#27374D] text-white rounded-3xl"
              >
                저장
              </button>
            </div>
          )}
        </div>

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
      </div>
    </div>
  );
};

export default ExamPlanStep3;
