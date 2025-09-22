import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StudyPlanStep1 from "./StudyPlanStep1";
import StudyPlanStep2 from "./StudyPlanStep2";
import StudyPlanDoneModal from "./StudyPlanDoneModal";
import studyRoutineApi from "../../api/studyRoutineApi";
import { getStudyRoutine } from "../../api/studyRoutineApi";

const StudyPlanStep = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [showCompleteModal, setShowCompleteModal] =
    useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        const data = await getStudyRoutine();
        if (data?.weeks_before_exam && data?.review_type) {
          const WEEKDAYS = [
            "MON",
            "TUE",
            "WED",
            "THU",
            "FRI",
            "SAT",
            "SUN",
          ];
          const tokens = String(data.review_type)
            .trim()
            .split(/\s+/);
          const isWeekdays = tokens.every((t) =>
            WEEKDAYS.includes(t)
          );

          setFormData((prev) => ({
            ...prev,
            weeksBeforeExam: data.weeks_before_exam ?? "",
            reviewType: isWeekdays
              ? "특정 요일에 복습"
              : "특정 루틴으로 복습",
            selectedWeekdays: isWeekdays ? tokens : [],
            selectedRoutine: !isWeekdays ? data.review_type : "",
          }));
        }
      } catch (error) {
        console.error("기존 공부 습관 불러오기 실패:", error);
      }
    };
    fetchExistingData();
  }, []);

  const nextStep = () => {
    if (step < 2) {
      setStep((prev) => prev + 1);
    }
  };

  const handleFinalSubmit = async (reviewType) => {
    try {
      const response = await studyRoutineApi(
        formData.weeksBeforeExam, // Step1 값
        reviewType // Step2에서 직접 전달받은 값
      );

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
