import { useState } from "react";

const ManualMode = ({ setSchedule }) => {
  const [subjects, setSubjects] = useState([
    {
      name: "",
      professor: "",
      day: "월요일",
      startHour: 9,
      endHour: 10,
      location: "",
    },
  ]);

  // 입력값 변경 시 해당 수업 정보 업데이트
  const handleChange = (index, field, value) => {
    const updatedSubjects = [...subjects];
    updatedSubjects[index][field] = value;
    setSubjects(updatedSubjects);
  };

  // 수업 추가
  const addSubject = () => {
    setSubjects([
      ...subjects,
      {
        name: "",
        professor: "",
        day: "월요일",
        startHour: 9,
        endHour: 11,
        location: "",
      },
    ]);
  };

  // 입력된 시간표 데이터를 상위 컴포넌트로 전달하고 초기화
  const handleSubmit = () => {
    setSchedule((prev) => [...prev, ...subjects]);
    setSubjects([
      {
        name: "",
        professor: "",
        day: "월요일",
        startHour: 9,
        endHour: 11,
        location: "",
      },
    ]);
  };

  return (
    <div className="p-4">
      <h3 className="text-xl font-bold mb-4">직접 시간표 입력</h3>
      {subjects.map((subject, index) => (
        <div key={index} className="flex flex-col gap-2 mb-3">
          {/* 과목명 입력 */}
          <label className="font-medium">과목명</label>
          <input
            type="text"
            value={subject.name}
            onChange={(e) => handleChange(index, "name", e.target.value)}
            className="border rounded px-2 py-1"
          />
          {/* 교수명 입력 */}
          <label className="font-medium">교수명</label>
          <input
            type="text"
            value={subject.professor}
            onChange={(e) => handleChange(index, "professor", e.target.value)}
            className="border rounded px-2 py-1"
          />
          {/* 요일 선택 */}
          <label className="font-medium">요일</label>
          <select
            value={subject.day}
            onChange={(e) => handleChange(index, "day", e.target.value)}
            className="border rounded px-2 py-1"
          >
            {["월요일", "화요일", "수요일", "목요일", "금요일", "토요일"].map(
              (day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              )
            )}
          </select>
          {/* 시간 선택 */}
          <label className="font-medium">시간</label>
          <div className="flex items-center gap-2">
            <select
              value={subject.startHour}
              onChange={(e) =>
                handleChange(index, "startHour", parseInt(e.target.value))
              }
              className="border rounded px-2 py-1"
            >
              {Array.from({ length: 15 }, (_, i) => i + 9).map((hour) => (
                <option key={hour} value={hour}>
                  {hour}:00
                </option>
              ))}
            </select>
            <span>~</span>
            <select
              value={subject.endHour}
              onChange={(e) =>
                handleChange(index, "endHour", parseInt(e.target.value))
              }
              className="border rounded px-2 py-1"
            >
              {Array.from({ length: 15 }, (_, i) => i + 9).map((hour) => (
                <option key={hour} value={hour}>
                  {hour}:00
                </option>
              ))}
            </select>
          </div>
          {/* 강의실 입력 */}
          <label className="font-medium">장소</label>
          <input
            type="text"
            value={subject.location}
            onChange={(e) => handleChange(index, "location", e.target.value)}
            className="border rounded px-2 py-1"
          />
        </div>
      ))}
      {/* 과목 추가 및 등록 버튼 */}
      <div className="flex space-x-4">
        <button onClick={addSubject} className="border rounded px-4 py-2">
          수업 추가
        </button>
        <button onClick={handleSubmit} className="border rounded px-4 py-2">
          등록
        </button>
      </div>
    </div>
  );
};

export default ManualMode;
