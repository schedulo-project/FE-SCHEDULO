import React from "react";
import TagBox from "./TagBox";

function TodoItem({ task, onCheck, checked }) {
  const bgColor = checked ? "bg-[#E0E0E0]" : "bg-[#F0F0F0]";

  console.log("TodoItem", task);
  return (
    <div
      className={`flex items-center justify-between ${bgColor} border-[#E0E0E0] border-4 rounded-[0.294rem] p-2 mb-2`}
    >
      <section>
        <span className="text-[0.625rem] text-[#1A1A1A] font-semibold font-[Inter]">
          {task.title}
        </span>
        <TagBox tags={task.tagName} />
      </section>
      <input type="checkbox" onChange={onCheck} checked={checked} />
    </div>
  );
}

export default TodoItem;
