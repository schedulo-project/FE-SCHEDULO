import { React, useState, useEffect } from "react";
import TagBox from "./TagBox";

//jotai
import { useAtom } from "jotai";
import {
  handelCheckAtom,
  isModalOpenAtom,
  modalDataAtom,
} from "../atoms/HomeAtoms";

function TodoItem({ task, checked }) {
  const [, setModalOpen] = useAtom(isModalOpenAtom);
  const [, setModalData] = useAtom(modalDataAtom);

  //jotai
  const [, setHandleCheck] = useAtom(handelCheckAtom);

  //체크박스 클릭시
  const handleCheck = (id) => {
    setHandleCheck(id);
  };

  //모달 클릭시
  const handleClick = () => {
    setModalData({
      id: task.id,
      title: task.title,
      date: task.date,
      content: task.content,
      tagName: task.tagName,
      is_completed: task.is_completed,
      deadline: task.deadline,
    });
    setModalOpen(true);
  };

  const bgColor = checked ? "bg-[#E0E0E0]" : "bg-[#F0F0F0]";
  const size =
    "min-w-[2rem] pr-[0.75rem] pl-[0.75rem] text-[0.375rem]";

  return (
    <>
      <div
        className={`flex items-center justify-between ${bgColor} border-[#E0E0E0] border-4 rounded-[0.294rem] p-2 mb-2`}
        onClick={() => handleClick()}
      >
        <section>
          <span className="text-[0.625rem] text-[#1A1A1A] font-semibold font-[Inter]">
            {task.title}
          </span>
          <TagBox tagNames={task.tagName} size={size} />
        </section>
        <input
          type="checkbox"
          onClick={(e) => e.stopPropagation()}
          onChange={() => handleCheck(task.id)}
          checked={checked}
        />
      </div>
    </>
  );
}

export default TodoItem;
