import { useState, useEffect } from "react";
import TodoCategory from "../components/TodoCategory";
//import CompletedTasks from "../components/CompletedTasks";
import ScheduleAddBtn from "../components/ScheduleAddBtn";

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
      const taskToComplete = todoList.find((task) => task.id === id);
      setTodoList((prev) => prev.filter((task) => task.id !== id));
      setCompletedTasks((prev) => [...prev, taskToComplete]);
    }
  };

  if (selectedEvents.length === 0) {
    return (
      <div
        className="flex justify-center pt-[0.75rem] pb-[0.75rem] pr-[0.8125rem] pl-[0.8125rem] 
                bg-[#F0F0F0] rounded-[0.294rem] border-[#E0E0E0] 
                border-4 w-80 max-w-[17.34519rem] min-h-[26.1875rem]"
      >
        <span className="text-[#1A1A1A] text-[0.73925rem] font-semibold font-[Inter]">
          오늘 일정이 없습니다.
        </span>
      </div>
    );
  }

  return (
    <div
      className="pt-[0.75rem] pb-[0.75rem] pr-[0.8125rem] pl-[0.8125rem] 
                bg-[#F0F0F0] rounded-[0.294rem] border-[#E0E0E0] 
                border-4 w-80 max-w-[17.34519rem] min-h-[26.1875rem]"
    >
      <section className="flex justify-between items-end">
        <span className="text-[#1A1A1A] text-[0.73925rem] font-semibold font-[Inter]">
          일정
        </span>
        <span className="text-[#010669] text-[0.625rem] font-semibold font-[Inter]">
          {selectedEvents[0].date}
        </span>
      </section>
      <section className="flex items-center mt-[0.69rem] mb-[0.69rem]">
        <span className="text-[0.55444rem] text-[#656565] font-[Inter] font-normal">
          todo
        </span>
        <div className="flex-grow h-[0.04619rem] bg-[#ABABAB] max-w-[11.95906rem] mx-[0.44rem]" />
        <ScheduleAddBtn />
      </section>
      <section>
        <TodoCategory
          todoList={todoList}
          onCheck={handleCheck}
          isCompleted={false}
        />
        <TodoCategory
          todoList={completedTasks}
          onCheck={handleCheck}
          isCompleted={true}
        />
      </section>
    </div>
  );
}

export default CheckSchedule;
