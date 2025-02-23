function CompletedTasks({ completedTasks, onCheck }) {
  return (
    <div>
      <h3>완료</h3>
      <hr />
      {completedTasks.map((task, idx) => (
        <div key={idx}>
          <input
            type="checkbox"
            checked={true}
            onChange={() => onCheck(task.tagName, task.name, true)}
          />
          {task.tagName} - {task.name}
        </div>
      ))}
    </div>
  );
}

export default CompletedTasks;
