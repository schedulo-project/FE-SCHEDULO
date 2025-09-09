import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudyPlanStep1 from "./StudyPlanStep1";
import StudyPlanStep2 from "./StudyPlanStep2";
import StudyPlanDoneModal from "./StudyPlanDoneModal";
import studyRoutineApi from "../../api/studyRoutineApi";

const StudyPlanStep = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [showCompleteModal, setShowCompleteModal] =
    useState(false);

  const navigate = useNavigate();

  const nextStep = () => {
    if (step < 2) {
      setStep((prev) => prev + 1);
    }
  };

  const handleFinalSubmit = async (reviewType) => {
    try {
      console.log("최종 전송 데이터:", {
        weeksBeforeExam: formData.weeksBeforeExam,
        reviewType: reviewType,
      });

      const response = await studyRoutineApi(
        formData.weeksBeforeExam, // Step1 값
        reviewType // Step2에서 직접 전달받은 값
      );

      console.log("공부 습관 저장 성공:", response.data);
      setShowCompleteModal(true);
    } catch (error) {
      console.error("공부 습관 저장 실패:", error);
      alert("저장 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleClose = () => {
    navigate("/");
  };

  const handleCompleteModalClose = () => {
    setShowCompleteModal(false);
    navigate("/");
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <StudyPlanStep1
            nextStep={nextStep}
            updateFormData={updateFormData}
            formData={formData}
            handleClose={handleClose}
          />
        );
      case 2:
        return (
          <StudyPlanStep2
            nextStep={nextStep}
            updateFormData={updateFormData}
            formData={formData}
            handleClose={handleClose}
            onFinalSubmit={handleFinalSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderStep()}
      {showCompleteModal && (
        <StudyPlanDoneModal onClose={handleCompleteModalClose} />
      )}
    </>
  );
};

export default StudyPlanStep;
