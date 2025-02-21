import React, { useState } from "react";
import DatePicker from "react-datepicker";
import LabelInput from "../components/LabelInput";
import Tag from "../components/Tag";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/ScheduleEdit.css";

function ScheduleEdit() {
  const [schedule, setSchedule] = useState({
    id: 1,
    date: new Date("2024-02-19"),
    starttime: "10:00",
    endtime: "11:00",
    title: "팀 회의",
    memo: "프로젝트 진행 상황 공유",
    tags: ["업무"], // 선택된 태그 목록
  });

  const tagOptions = ["업무", "운동", "게임", "휴식", "공부"]; // 사용자가 등록했던 태그 목록

  // 태그 변경 핸들러
  const handleTagsChange = (newTags) => {
    setSchedule({ ...schedule, tags: newTags });
  };

  return (
    <div className="schedule_edit_container">
      <h2>일정 수정</h2>

      <LabelInput
        label="일정 이름"
        type="text"
        value={schedule.title}
        onChange={(e) =>
          setSchedule({ ...schedule, title: e.target.value })
        }
      />

      <label>태그</label>
      <Tag
        selectedTags={schedule.tags}
        tagOptions={tagOptions}
        onChange={handleTagsChange}
      />

      <label>종료 일자</label>
      <DatePicker
        selected={schedule.date}
        onChange={(date) => setSchedule({ ...schedule, date })}
        dateFormat="yyyy-MM-dd"
        placeholderText="날짜 선택"
      />

      <label>메모</label>
      <textarea
        value={schedule.memo}
        onChange={(e) =>
          setSchedule({ ...schedule, memo: e.target.value })
        }
      />

      <div className="button_container">
        <button
          className="save_button"
          onClick={() => console.log(schedule)}
        >
          저장
        </button>
      </div>
    </div>
  );
}

export default ScheduleEdit;
