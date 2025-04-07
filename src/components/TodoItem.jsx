import { React, useState } from "react";
import TagBox from "./TagBox";
import ScheduleModal from "./ScheduleModal";

function TodoItem({ task, onCheck, checked, onChange }) {
  const bgColor = checked ? "bg-[#E0E0E0]" : "bg-[#F0F0F0]";
  const [isModalOpen, setModalOpen] = useState(false);
  const size =
    "min-w-[2rem] pr-[0.75rem] pl-[0.75rem] text-[0.375rem]";

  return (
    <>
      <div
        className={`flex items-center justify-between ${bgColor} border-[#E0E0E0] border-4 rounded-[0.294rem] p-2 mb-2`}
        onClick={() => setModalOpen(true)}
      >
        <section>
          <span className="text-[0.625rem] text-[#1A1A1A] font-semibold font-[Inter]">
            {task.title}
          </span>
          <TagBox tagNames={task.tagName} size={size} />
        </section>
        <input
          type="checkbox"
          onChange={onCheck}
          checked={checked}
        />
      </div>
      <ScheduleModal
        isModalOpen={isModalOpen && !checked}
        data={task}
        setIsModalOpen={setModalOpen}
        onChange={onChange}
      />
    </>
  );
}

export default TodoItem;
