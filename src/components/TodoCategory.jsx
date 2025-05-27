import React from "react";
import TodoItem from "./TodoItem";
import { useAtom } from "jotai";
import { WitchGroupAtom } from "../atoms/HomeAtoms";

function TodoCategory({ todoList }) {
  const [witchGroup] = useAtom(WitchGroupAtom);

  if (todoList.length === 0) return null;

  const groupBy = (list) => {
    const tagGroups = new Map();
    const noTagGroup = [];
    const completedGroup = [];

    list.forEach((task) => {
      if (task.is_completed) {
        completedGroup.push(task);
      } else {
        const firstTag = task.tagName?.split(",")[0]?.trim();
        if (firstTag) {
          if (!tagGroups.has(firstTag)) {
            tagGroups.set(firstTag, []);
          }
          tagGroups.get(firstTag).push(task);
        } else {
          noTagGroup.push(task);
        }
      }
    });

    // 최종 배열 구성
    const result = [];

    // 1. 태그로 묶인 작업
    for (const [tag, tasks] of tagGroups.entries()) {
      result.push({ tag, task: tasks });
    }

    // 2. 태그 없음 그룹 추가
    if (noTagGroup.length > 0) {
      result.push({ tag: "태그 없음", task: noTagGroup });
    }

    // 3. 완료 그룹 추가
    if (completedGroup.length > 0) {
      result.push({ tag: "완료", task: completedGroup });
    }

    return result;
  };

  const filterAllList = (list) => {
    const todoList = list.filter((t) => !t.is_completed);
    const completedList = list.filter((t) => t.is_completed);
    const result = [];
    if (todoList.length > 0) {
      result.push({
        tag: "전체",
        task: todoList,
      });
    }
    if (completedList.length > 0) {
      result.push({
        tag: "완료",
        task: completedList,
      });
    }
    return result;
  };

  const groupedList =
    witchGroup === "태그 정렬"
      ? groupBy(todoList)
      : filterAllList(todoList);

  return (
    <div>
      {groupedList.map((group) => (
        <div key={group.tag}>
          <section className="flex items-center mt-[0.69rem] mb-[0.69rem]">
            <span className="text-[0.55444rem] text-[#656565] font-[Inter] font-normal">
              {group.tag}
            </span>
            <div className="flex-grow h-[0.04619rem] bg-[#ABABAB] max-w-[14.33019rem] mx-[0.44rem]" />
          </section>
          {group.task.map((task) => (
            <TodoItem
              key={task.id}
              task={task}
              checked={task.is_completed}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export default TodoCategory;
