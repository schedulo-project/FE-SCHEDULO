import React, { useState } from "react";
import { ChevronRight } from "lucide-react";
import bookLogo from "../../assets/logo/book_square.svg";

const StudyPlanStep3 = ({
  nextStep,
  updateFormData,
  formData = {},
  handleClose,
}) => {
  const options = [
    "5:5",
    "6:4",
    "7:3",
    "8:2",
    "9:1",
    "직접 입력",
  ];

  const [selectedOption, setSelectedOption] = useState(
    formData.studyRestRatio &&
      !options.includes(formData.studyRestRatio)
      ? "직접 입력"
      : formData.studyRestRatio || ""
  );
  const [customValue, setCustomValue] = useState(
    options.includes(formData.studyRestRatio)
      ? ""
      : formData.studyRestRatio || ""
  );

  const handleSelect = (option) => {
    setSelectedOption(option);
    if (option !== "직접 입력") {
      setCustomValue("");
    }
  };

  const handleNext = () => {
    const valueToSubmit =
      selectedOption === "직접 입력"
        ? customValue
        : selectedOption;

    if (!valueToSubmit || valueToSubmit.trim() === "") {
      alert("옵션을 선택하거나 값을 입력해주세요.");
      return;
    }

    let structuredValue;

    if (valueToSubmit.match(/^\d+:\d+$/)) {
      const [study, rest] = valueToSubmit.split(":").map(Number);
      const total = study + rest;

      if (total === 0) {
        alert("유효한 비율을 입력해주세요.");
        return;
      }

      structuredValue = {
        type: "ratio",
        studyPercent: Math.round((study / total) * 100),
        restPercent: Math.round((rest / total) * 100),
      };
    } else {
      structuredValue = {
        type: "custom",
        raw: valueToSubmit,
      };
    }

    console.log("선택한 값:", valueToSubmit);
    console.log("구조화된 값:", structuredValue);

    updateFormData({
      studyRestRatio: valueToSubmit,
      studyRestRatioStructured: structuredValue,
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
        <div className="w-[950px] h-[550px] bg-white rounded-3xl shadow-lg overflow-hidden relative">
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
          <div className="px-8 py-16 relative h-[calc(100%-110px)]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center space-y-12">
              <p className="text-center text-gray-700 text-xl">
                3. 공부와 휴식의 비율은 어떻게 되시나요?
              </p>

              <div className="relative">
                <div className="flex flex-wrap justify-center gap-4 w-full max-w-md">
                  {options.map((option) => (
                    <button
                      key={option}
                      onClick={() => handleSelect(option)}
                      className={`px-5 py-3 rounded-full border-2 transition-colors text-sm
            ${
              selectedOption === option
                ? "bg-[#9DB2BF] text-white border-[#9DB2BF]"
                : "bg-white text-gray-700 border-gray-300 hover:border-[#9DB2BF]"
            }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                {/* 직접 입력일 경우 */}
                {selectedOption === "직접 입력" && (
                  <div className="w-full flex justify-center">
                    <input
                      type="text"
                      className="border-2 border-gray-300 rounded-lg px-6 py-4 w-80 text-center text-lg mt-8 focus:outline-none focus:border-[#9DB2BF] transition-colors"
                      placeholder="직접 비율을 입력하세요"
                      value={customValue}
                      onChange={(e) =>
                        setCustomValue(e.target.value)
                      }
                    />
                  </div>
                )}
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

export default StudyPlanStep3;
