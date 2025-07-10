import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudyPlanStep1 from "./StudyPlanStep1";
import StudyPlanStep2 from "./StudyPlanStep2";
import StudyPlanStep3 from "./StudyPlanStep3";
import StudyPlanStep4 from "./StudyPlanStep4";
import StudyPlanStep5 from "./StudyPlanStep5";
import StudyPlanDoneModal from "./StudyPlanDoneModal";

const StudyPlanStep = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    weeksBeforeExam: "",
    reviewTiming: "",
    studyRestRatio: "",
    studyAmountCriteria: "",
    assignmentTiming: "",
  });
  const [showCompleteModal, setShowCompleteModal] =
    useState(false);

  const navigate = useNavigate();

  const nextStep = () => {
    if (step < 5) {
      setStep((prev) => prev + 1);
    } else {
      setShowCompleteModal(true);
    }
  };

  const updateFormData = (newData) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handleClose = () => {
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
          />
        );
      case 3:
        return (
          <StudyPlanStep3
            nextStep={nextStep}
            updateFormData={updateFormData}
            formData={formData}
            handleClose={handleClose}
          />
        );
      case 4:
        return (
          <StudyPlanStep4
            nextStep={nextStep}
            updateFormData={updateFormData}
            formData={formData}
            handleClose={handleClose}
          />
        );
      case 5:
        return (
          <StudyPlanStep5
            nextStep={nextStep}
            updateFormData={updateFormData}
            formData={formData}
            handleClose={handleClose}
          />
        );
      default:
        return;
    }
  };

  return (
    <>
      {renderStep()}
      {showCompleteModal && <StudyPlanDoneModal />}
    </>
  );
};

export default StudyPlanStep;
