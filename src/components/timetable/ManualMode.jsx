import { useState } from "react";

const DAYS = ["월", "화", "수", "목", "금", "토"];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 9);

const SubjectInput = ({ subject, index, handleChange }) => (
  <div className="flex flex-col gap-2 mb-6">
    <label className="font-medium">과목명</label>
    <input
      type="text"
      value={subject.name}
      onChange={(e) => handleChange(index, "name", e.target.value)}
      className="border rounded px-2 py-1"
    />

    <label className="font-medium">교수명</label>
    <input
      type="text"
      value={subject.professor}
      onChange={(e) => handleChange(index, "professor", e.target.value)}
      className="border rounded px-2 py-1"
    />

    <label className="font-medium">요일</label>
    <select
      value={subject.day}
      onChange={(e) => handleChange(index, "day", e.target.value)}
      className="border rounded px-2 py-1"
    >
      {DAYS.map((day) => (
        <option key={day} value={day}>
          {day}
        </option>
      ))}
    </select>

    <label className="font-medium">시간</label>
    <div className="flex items-center gap-2">
      <select
        value={subject.startHour}
        onChange={(e) =>
          handleChange(index, "startHour", parseInt(e.target.value))
        }
        className="border rounded px-2 py-1"
      >
        {HOURS.map((hour) => (
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
        {HOURS.map((hour) => (
          <option key={hour} value={hour}>
            {hour}:00
          </option>
        ))}
      </select>
    </div>

    <label className="font-medium">장소</label>
    <input
      type="text"
      value={subject.location}
      onChange={(e) => handleChange(index, "location", e.target.value)}
      className="border rounded px-2 py-1"
    />
  </div>
);

const ManualMode = ({ setSchedule }) => {
  const [subjects, setSubjects] = useState([
    {
      name: "",
      professor: "",
      day: "월",
      startHour: 9,
      endHour: 10,
      location: "",
    },
  ]);

  const handleChange = (index, field, value) => {
    setSubjects((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const addSubject = () => {
    setSubjects((prev) => [
      ...prev,
      {
        name: "",
        professor: "",
        day: "월",
        startHour: 9,
        endHour: 11,
        location: "",
      },
    ]);
  };

  const handleSubmit = () => {
    setSchedule((prev) => [...prev, ...subjects]);
    setSubjects([
      {
        name: "",
        professor: "",
        day: "월",
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
        <SubjectInput
          key={index}
          subject={subject}
          index={index}
          handleChange={handleChange}
        />
      ))}
      <div className="flex gap-4">
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
