import { React, useState } from "react";
import TagBox from "./TagBox";
import ScheduleModal from "./ScheduleModal";

//jotai
import { useAtom } from "jotai";
import { handelCheckAtom } from "../atoms/HomeAtoms";

function TodoItem({ task, checked }) {
  //jotai
  const [, setHandleCheck] = useAtom(handelCheckAtom);
  const handleCheck = (id) => {
    setHandleCheck(id);
  };

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
          onChange={() => handleCheck(task.id)}
          checked={checked}
        />
      </div>
      <ScheduleModal
        isModalOpen={isModalOpen && !checked}
        data={task}
        setIsModalOpen={setModalOpen}
      />
    </>
  );
}

export default TodoItem;
