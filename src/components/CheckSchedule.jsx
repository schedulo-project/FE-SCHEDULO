import { useState } from "react";
import TodoCategory from "../components/TodoCategory";
import CompletedTasks from "../components/CompletedTasks";
import "../styles/CheckSchedule.css";

function CheckSchedule() {
  //더미 데이터
  const initialTodoList = [
    {
      tagName: "공부",
      checklist: [
        { name: "알고리즘 문제 풀기", completed: false },
        { name: "React 공부하기", completed: false },
        { name: "SQL 복습하기", completed: false },
      ],
    },
    {
      tagName: "운동",
      checklist: [
        { name: "헬스장 가기", completed: false },
        { name: "런닝 30분 하기", completed: false },
        { name: "스트레칭 하기", completed: false },
      ],
    },
    {
      tagName: "쇼핑",
      checklist: [
        { name: "장보기 리스트 작성", completed: false },
        { name: "마트 가기", completed: false },
        { name: "온라인 쇼핑하기", completed: false },
      ],
    },
  ];

  const [todoList, setTodoList] = useState(
    initialTodoList.map((item) => {
      return {
        ...item,
        checklist: item.checklist.filter((task) => !task.completed),
      };
    })
  );

  const [completedTasks, setCompletedTasks] = useState(
    initialTodoList.flatMap((item) =>
      item.checklist
        .filter((task) => task.completed)
        .map((task) => ({
          tagName: item.tagName,
          name: task.name,
        }))
    )
  );

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

  return (
    <div className="schedule_container">
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
    </div>
  );
}

export default CheckSchedule;

//ture면 위에 리스트에
//false면 아래 리스트에
//다 ture면 태그 이름과 <hr>이 사라져야 한다

//1. useState를 2개 만들어서 completedTasks, todoList로 나눠서 사용
