import React from "react";
import TodoItem from "./TodoItem";

function TodoCategory({ category, onCheck }) {
  if (category.checklist.length === 0) return null;

  return (
    <div>
      <h3>{category.tagName}</h3>
      <hr />
      {category.checklist.map((task, idx) => (
        <TodoItem
          key={idx}
          tag={category.tagName}
          task={task}
          onCheck={onCheck}
        />
      ))}
    </div>
  );
}

export default TodoCategory;
