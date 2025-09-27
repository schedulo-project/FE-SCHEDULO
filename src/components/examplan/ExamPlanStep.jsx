import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ExamPlanStep1 from "./ExamPlanStep1";
import ExamPlanStep2 from "./ExamPlanStep2";
import ExamPlanStep3 from "./ExamPlanStep3";
import ExamPlanStep4 from "./ExamPlanStep4";

const ExamPlanStep = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    examName: "",
    startDate: "",
    endDate: "",
    subjects: [],
    totalWeeks: "",
    averageSubjectsPerDay: "",
  });

  const navigate = useNavigate();

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-50 bg-white flex flex-col items-center">
      {/* 네비게이션 바 */}
      <div
        className="w-full flex items-center justify-between "
        style={{
          backgroundColor: "#27374D",
          height: "66px",
          minHeight: "66px",
          maxHeight: "66px",
          padding: "1px 5px",
          overflow: "hidden",
        }}
      >
        <h1 className="text-white text-xl font-semibold mx-auto">
          시험공부 계획설정
        </h1>
        <button
          onClick={handleClose}
          className="absolute right-4 text-white text-[1.5rem] font-semibold z-20"
          aria-label="시험공부 계획 설정 닫기"
        >
          ✕
        </button>
      </div>
      {/* 본문 영역 */}
      <div className="w-full flex justify-center flex-1">
        {step === 1 && (
          <ExamPlanStep1
            formData={formData}
            updateFormData={updateFormData}
            nextStep={nextStep}
          />
        )}
        {step === 2 && (
          <ExamPlanStep2
            formData={formData}
            updateFormData={updateFormData}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )}
        {step === 3 && (
          <ExamPlanStep3
            formData={formData}
            updateFormData={updateFormData}
            prevStep={prevStep}
            nextStep={nextStep}
          />
        )}
        {step === 4 && (
          <ExamPlanStep4
            formData={formData}
            updateFormData={updateFormData}
            prevStep={prevStep}
          />
        )}
      </div>
    </div>
  );
};

export default ExamPlanStep;
