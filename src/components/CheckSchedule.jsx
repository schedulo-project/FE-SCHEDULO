import { useState, useEffect } from "react";
import TodoCategory from "../components/TodoCategory";
import CompletedTasks from "../components/CompletedTasks";

function CheckSchedule({ selectedEvents }) {
  const [todoList, setTodoList] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    if (selectedEvents && selectedEvents.length > 0) {
      const newTodoList = selectedEvents.map((event) => ({
        id: event.id,
        date: event.date,
        title: event.title,
        tagName: event.tagName,
      }));
      setTodoList(newTodoList);
      setCompletedTasks([]);
    }
  }, [selectedEvents]);

  const handleCheck = (id, isCompleted) => {
    if (isCompleted) {
      // 체크 해제 시 원래 리스트로 복구
      const completedTask = completedTasks.find(
        (task) => task.id === id
      );
      setCompletedTasks((prev) =>
        prev.filter((task) => task.id !== id)
      );
      setTodoList((prev) => [...prev, completedTask]);
    } else {
      // 체크 시 완료 리스트로 이동
      const taskToComplete = todoList.find(
        (task) => task.id === id
      );
      setTodoList((prev) =>
        prev.filter((task) => task.id !== id)
      );
      setCompletedTasks((prev) => [...prev, taskToComplete]);
    }
  };

  if (selectedEvents.length === 0) {
    return (
      <div className="mt-5 p-5 bg-blue-50 rounded-2xl w-80">
        오늘 일정이 없습니다.
      </div>
    );
  }

  return (
    <div className="mt-5 p-5 bg-blue-50 rounded-2xl w-80">
      <section className="text-[24px] font-bold">
        오늘의 일정
      </section>
      <br />
      <section>
        <TodoCategory
          todoList={todoList}
          onCheck={handleCheck}
        />
        <CompletedTasks
          completedTasks={completedTasks}
          onCheck={handleCheck}
        />
      </section>
    </div>
  );
}

export default CheckSchedule;
