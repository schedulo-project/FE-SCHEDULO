import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import bookLogo from "../../assets/logo/book_square.svg";

const PlanStep1 = ({
  nextStep,
  updateFormData,
  formData = {},
  handleClose,
}) => {
  const [week, setWeek] = useState(
    formData.weeksBeforeExam || ""
  );

  const handleNext = () => {
    if (!week || Number(week) < 1) {
      alert("몇 주 전에 시작할지 입력해주세요.");
      return;
    }

    const structuredValue = {
      type: "relative",
      offset: -Number(week),
      unit: "week",
      reference: "exam",
    };

    console.log("선택한 값:", week);
    console.log("구조화된 값:", structuredValue);

    updateFormData({
      weeksBeforeExam: week,
      weeksBeforeExamStructured: structuredValue,
    });
    nextStep();
  };

  return (
    <div className="min-h-screen w-full bg-[#DDE6ED] relative">
      {/* 로고 */}
      <div className="absolute top-32 left-36 flex items-center space-x-3">
        <img
          src={bookLogo}
          alt="logo"
          className="w-[47px] h-[47px]"
        />
        <span className="text-[#27374D] text-3xl">Schedulo</span>
      </div>

      {/* 모달 박스 */}
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-[950px] h-[550px] bg-white rounded-3xl shadow-lg overflow-hidden">
          {/* 헤더 */}
          <div className="bg-[#27374D] h-[110px] py-8 px-8 flex justify-between items-center">
            <span className="text-white text-2xl font-semibold mx-auto">
              공부 계획 등록
            </span>
            <button
              className="text-white text-2xl font-bold hover:opacity-70 transition-opacity"
              onClick={handleClose}
            >
              ✕
            </button>
          </div>
          {/* 본문 */}
          <div className="px-8 py-16 flex flex-col items-center justify-center space-y-12 relative h-[calc(100%-110px)]">
            <p className="text-center text-gray-700 text-xl">
              1. 몇 주 전에 시험 공부를 시작하시나요?
            </p>
            <div className="relative">
              <input
                type="number"
                min={1}
                value={week}
                onChange={(e) => setWeek(e.target.value)}
                className="border-2 border-gray-300 rounded-lg px-6 py-4 w-80 text-center text-lg focus:outline-none focus:border-[#9DB2BF] transition-colors"
                placeholder=""
              />
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
  );
};

export default PlanStep1;
