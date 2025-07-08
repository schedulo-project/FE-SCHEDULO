import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PlanStep1 from "./PlanStep1";
import PlanStep2 from "./PlanStep2";
import PlanStep3 from "./PlanStep3";
import PlanStep4 from "./PlanStep4";
import PlanStep5 from "./PlanStep5";
import SetupDoneModal from "./SetupDoneModal";

export default function PlanStep() {
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
          <PlanStep1
            nextStep={nextStep}
            updateFormData={updateFormData}
            formData={formData}
            handleClose={handleClose}
          />
        );
      case 2:
        return (
          <PlanStep2
            nextStep={nextStep}
            updateFormData={updateFormData}
            formData={formData}
            handleClose={handleClose}
          />
        );
      case 3:
        return (
          <PlanStep3
            nextStep={nextStep}
            updateFormData={updateFormData}
            formData={formData}
            handleClose={handleClose}
          />
        );
      case 4:
        return (
          <PlanStep4
            nextStep={nextStep}
            updateFormData={updateFormData}
            formData={formData}
            handleClose={handleClose}
          />
        );
      case 5:
        return (
          <PlanStep5
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
      {showCompleteModal && <SetupDoneModal />}
    </>
  );
}
