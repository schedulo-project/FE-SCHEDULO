import React from "react";
import TodoItem from "./TodoItem";

function TodoCategory({ todoList, onCheck, isCompleted }) {
  if (todoList.length === 0) return null;

  return (
    <div>
      {isCompleted && (
        <section className="flex items-center mt-[0.69rem] mb-[0.69rem]">
          <span className="text-[0.55444rem] text-[#656565] font-[Inter] font-normal">
            complete
          </span>
          <div className="flex-grow h-[0.04619rem] bg-[#ABABAB] max-w-[12.33019rem] mx-[0.44rem]" />
        </section>
      )}
      {todoList.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          onCheck={() => onCheck(task.id, isCompleted)}
          checked={isCompleted}
        />
      ))}
    </div>
  );
}

export default TodoCategory;
