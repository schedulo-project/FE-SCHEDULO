import { useState } from "react";

const StudyPlanForm = () => {
  const [studyPlan, setStudyPlan] = useState({
    examStart: "",
    reviewTime: "",
    studyBreakRatio: "",
    studyAmountCriteria: "",
    taskPreference: "",
  });

  // "직접 입력"을 선택했는지 여부 저장
  const [customInputs, setCustomInputs] = useState({
    examStart: false,
    reviewTime: false,
    studyBreakRatio: false,
    studyAmountCriteria: false,
    taskPreference: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCustomInputs((prev) => ({
      ...prev,
      [name]: value === "직접 입력",
    }));

    // "직접 입력"을 선택하면 초기화하지 않고 유지
    setStudyPlan((prev) => ({
      ...prev,
      [name]: value === "직접 입력" ? prev[name] || "" : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("등록된 공부 계획:", studyPlan);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">공부 계획 등록</h2>
      <form
        className="flex flex-col gap-4 border border-gray-300 p-6 rounded-md"
        onSubmit={handleSubmit}
      >
        <label className="font-medium">
          몇 주 전에 시험 공부를 시작하시나요?
        </label>
        <select
          name="examStart"
          onChange={handleChange}
          value={studyPlan.examStart}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="">선택</option>
          <option value="1주">1주</option>
          <option value="2주">2주</option>
          <option value="3주">3주</option>
          <option value="4주">4주</option>
          <option value="직접 입력">직접 입력</option>
        </select>
        {customInputs.examStart && (
          <input
            type="text"
            name="examStart"
            placeholder="직접 입력"
            onChange={(e) =>
              setStudyPlan((prev) => ({ ...prev, examStart: e.target.value }))
            }
            value={studyPlan.examStart}
            className="border border-gray-300 rounded px-2 py-1"
          />
        )}

        <label className="font-medium">복습은 언제하시나요?</label>
        <select
          name="reviewTime"
          onChange={handleChange}
          value={studyPlan.reviewTime}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="">선택</option>
          <option value="매일">매일</option>
          <option value="시험 1주 전">시험 1주 전</option>
          <option value="시험 2주 전">시험 2주 전</option>
          <option value="시험 3주 전">시험 3주 전</option>
          <option value="직접 입력">직접 입력</option>
        </select>
        {customInputs.reviewTime && (
          <input
            type="text"
            name="reviewTime"
            placeholder="직접 입력"
            onChange={(e) =>
              setStudyPlan((prev) => ({ ...prev, reviewTime: e.target.value }))
            }
            value={studyPlan.reviewTime}
            className="border border-gray-300 rounded px-2 py-1"
          />
        )}

        <label className="font-medium">
          공부와 휴식의 비율은 어떻게 되시나요?
        </label>
        <select
          name="studyBreakRatio"
          onChange={handleChange}
          value={studyPlan.studyBreakRatio}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="">선택</option>
          <option value="5:5">5:5</option>
          <option value="6:4">6:4</option>
          <option value="7:3">7:3</option>
          <option value="8:2">8:2</option>
          <option value="9:1">9:1</option>
          <option value="직접 입력">직접 입력</option>
        </select>
        {customInputs.studyBreakRatio && (
          <input
            type="text"
            name="studyBreakRatio"
            placeholder="직접 입력"
            onChange={(e) =>
              setStudyPlan((prev) => ({
                ...prev,
                studyBreakRatio: e.target.value,
              }))
            }
            value={studyPlan.studyBreakRatio}
            className="border border-gray-300 rounded px-2 py-1"
          />
        )}

        <label className="font-medium">
          시험 공부의 할당량을 정하는 기준이 무엇인가요?
        </label>
        <select
          name="studyAmountCriteria"
          onChange={handleChange}
          value={studyPlan.studyAmountCriteria}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="">선택</option>
          <option value="페이지 수">페이지 수</option>
          <option value="시간">시간</option>
          <option value="완료한 챕터 수">완료한 챕터 수</option>
          <option value="직접 입력">직접 입력</option>
        </select>
        {customInputs.studyAmountCriteria && (
          <input
            type="text"
            name="studyAmountCriteria"
            placeholder="직접 입력"
            onChange={(e) =>
              setStudyPlan((prev) => ({
                ...prev,
                studyAmountCriteria: e.target.value,
              }))
            }
            value={studyPlan.studyAmountCriteria}
            className="border border-gray-300 rounded px-2 py-1"
          />
        )}

        <label className="font-medium">
          과제는 언제 시작/마감하는 것을 선호하시나요?
        </label>
        <select
          name="taskPreference"
          onChange={handleChange}
          value={studyPlan.taskPreference}
          className="border border-gray-300 rounded px-2 py-1"
        >
          <option value="">선택</option>
          <option value="바로 시작">바로 시작</option>
          <option value="마감 하루 전">마감 하루 전</option>
          <option value="마감 3일 전">마감 3일 전</option>
          <option value="마감 1주 전">마감 1주 전</option>
          <option value="직접 입력">직접 입력</option>
        </select>
        {customInputs.taskPreference && (
          <input
            type="text"
            name="taskPreference"
            placeholder="직접 입력"
            onChange={(e) =>
              setStudyPlan((prev) => ({
                ...prev,
                taskPreference: e.target.value,
              }))
            }
            value={studyPlan.taskPreference}
            className="border border-gray-300 rounded px-2 py-1"
          />
        )}

        <button
          type="submit"
          className="border border-gray-300 rounded px-4 py-2"
        >
          등록
        </button>
      </form>
    </div>
  );
};

export default StudyPlanForm;
