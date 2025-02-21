function TodoItem({ tag, task, onCheck }) {
  return (
    <div>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onCheck(tag, task.name, task.completed)}
      />
      {task.name}
    </div>
  );
}

export default TodoItem;
