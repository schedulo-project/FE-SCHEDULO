import React from "react";
import TodoItem from "./TodoItem";

function TodoCategory({ todoList }) {
  if (todoList.length === 0) return null;
  console.log("todoList", todoList);

  return (
    <div>
      {/* 완료되지 않은 항목 */}
      {todoList
        .filter((task) => !task.is_completed)
        .map((task) => (
          <TodoItem key={task.id} task={task} checked={false} />
        ))}

      {/* 완료된 항목 */}
      {todoList.some((task) => task.is_completed) && (
        <section className="flex items-center mt-[0.69rem] mb-[0.69rem]">
          <span className="text-[0.55444rem] text-[#656565] font-[Inter] font-normal">
            complete
          </span>
          <div className="flex-grow h-[0.04619rem] bg-[#ABABAB] max-w-[12.33019rem] mx-[0.44rem]" />
        </section>
      )}
      {todoList
        .filter((task) => task.is_completed)
        .map((task) => (
          <TodoItem key={task.id} task={task} checked={true} />
        ))}
    </div>
  );
}

export default TodoCategory;
