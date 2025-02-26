import React, { useState } from "react";
import TodoItem from "./TodoItem";
import ScheduleEdit from "../components/ScheduleEdit"; // ScheduleEdit 모달로 사용

function TodoCategory({ category, onCheck }) {
  const [isScheduleEditModalOpen, setIsScheduleEditModalOpen] =
    useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  // 수정 버튼 클릭 시 ScheduleEdit 모달 열기
  const openScheduleEditModal = (task) => {
    setSelectedTask(task); // 선택된 작업 정보를 ScheduleEdit에 전달
    setIsScheduleEditModalOpen(true); // ScheduleEdit 모달 열기
  };

  // ScheduleEdit 모달 닫기
  const closeScheduleEditModal = () => {
    setIsScheduleEditModalOpen(false);
    setSelectedTask(null);
  };

  if (category.checklist.length === 0) return null;

  return (
    <div>
      <h3>{category.tagName}</h3>
      <hr />
      {category.checklist.map((task, idx) => (
        <div className="flex justify-between" key={idx}>
          <TodoItem
            tag={category.tagName}
            task={task}
            onCheck={onCheck}
          />
          <button onClick={() => openScheduleEditModal(task)}>
            수정
          </button>
        </div>
      ))}
      <br />

      {/* ScheduleEdit 모달 */}
      {isScheduleEditModalOpen && selectedTask && (
        <ScheduleEdit
          task={selectedTask}
          closeModal={closeScheduleEditModal}
        />
      )}
    </div>
  );
}

export default TodoCategory;
