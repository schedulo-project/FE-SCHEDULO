//이제 필요 없음

function CompletedTasks({ completedTasks, onCheck }) {
  if (completedTasks.length === 0) return null;

  return (
    <div>
      <h3>완료된 일정</h3>
      <hr />
      {completedTasks.map((task) => (
        <div key={task.id}>
          {task.title} ({task.tagName})
          <input
            type="checkbox"
            checked={true}
            onChange={() => onCheck(task.id, true)}
          />
        </div>
      ))}
    </div>
  );
}

export default CompletedTasks;
