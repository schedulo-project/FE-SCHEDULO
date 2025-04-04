import { useState, useEffect } from "react";
import TodoCategory from "../components/TodoCategory";
import CompletedTasks from "../components/CompletedTasks";

function CheckSchedule({ selectedEvents }) {
  const [todoList, setTodoList] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

  console.log(selectedEvents);
  useEffect(() => {
    if (selectedEvents && selectedEvents.length > 0) {
      const newTodoList = selectedEvents.map((event) => ({
        tagName: event.tagName,
        checklist: event.checklist,
      }));
      setTodoList(newTodoList);
      setCompletedTasks([]);
    }
  }, [selectedEvents]);

  const handleCheck = (tag, taskName, isCompleted) => {
    if (isCompleted) {
      // 체크 해제 시 원래 카테고리로 복구
      setCompletedTasks((prev) =>
        prev.filter((task) => task.name !== taskName)
      );
      setTodoList((prev) =>
        prev.map((category) =>
          category.tagName === tag
            ? {
                ...category,
                checklist: [
                  ...category.checklist,
                  { name: taskName, completed: false },
                ],
              }
            : category
        )
      );
    } else {
      // 체크 시 완료로 이동
      setTodoList((prev) =>
        prev.map((category) =>
          category.tagName === tag
            ? {
                ...category,
                checklist: category.checklist.filter(
                  (task) => task.name !== taskName
                ),
              }
            : category
        )
      );
      setCompletedTasks((prev) => [
        ...prev,
        { tagName: tag, name: taskName },
      ]);
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
      <section>오늘 날짜 들어갈거임</section>
      <section>
        {todoList.map((category, index) => (
          <TodoCategory
            key={index}
            category={category}
            onCheck={handleCheck}
          />
        ))}
        <CompletedTasks
          completedTasks={completedTasks}
          onCheck={handleCheck}
        />
      </section>
    </div>
  );
}

export default CheckSchedule;

//ture면 위에 리스트에
//false면 아래 리스트에
//다 ture면 태그 이름과 <hr>이 사라져야 한다

//1. useState를 2개 만들어서 completedTasks, todoList로 나눠서 사용
