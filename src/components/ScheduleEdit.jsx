import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import LabelInput from "../components/LabelInput";
import Tag from "../components/Tag";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/ScheduleEdit.css";

function ScheduleEdit({ task, closeModal }) {
  const [schedule, setSchedule] = useState({
    ...task, // 기존 일정 정보로 상태 초기화
  });

  const tagOptions = [
    "업무",
    "운동",
    "게임",
    "휴식",
    "공부",
    "운영체제",
  ]; // 사용자가 등록했던 태그 목록

  const handleTagsChange = (newTags) => {
    setSchedule({ ...schedule, tagName: newTags });
  };
  console.log(schedule);

  return (
    <div className="modal-overlay">
      <div className="schedule_edit_container">
        <LabelInput
          label="일정 이름"
          type="text"
          value={schedule.name}
          onChange={(e) =>
            setSchedule({ ...schedule, title: e.target.value })
          }
        />

        <label>태그</label>
        <Tag
          selectedTags={schedule.tagName}
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
            onClick={() => closeModal()}
          >
            저장
          </button>
          <button
            className="save_button"
            onClick={() => closeModal()}
          >
            취소
          </button>
          <button
            className="save_button"
            onClick={() => closeModal()}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
}

export default ScheduleEdit;
