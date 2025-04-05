function TodoItem({ task, onCheck }) {
  return (
    <div>
      {task.title} ({task.tagName})
      <input type="checkbox" onChange={onCheck} />
    </div>
  );
}

export default TodoItem;
