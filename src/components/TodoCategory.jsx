import React from "react";
import TodoItem from "./TodoItem";

function TodoCategory({ todoList, onCheck }) {
  if (todoList.length === 0) return null;

  return (
    <div>
      <h3>할 일</h3>
      <hr />
      {todoList.map((task) => (
        <TodoItem
          key={task.id}
          task={task}
          onCheck={() => onCheck(task.id, false)}
        />
      ))}
      <br />
    </div>
  );
}

export default TodoCategory;
