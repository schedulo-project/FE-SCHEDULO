import React, { useState } from "react";
import TodoItem from "./TodoItem";
import { useAtom } from "jotai";
import {
  WitchGroupAtom,
  openGroupsAtom,
} from "../atoms/HomeAtoms";

//이미지
import arrowBtn from "../assets/checkschedule/arrow.svg";

function TodoCategory({ todoList }) {
  const [witchGroup] = useAtom(WitchGroupAtom);

  //토글의 상태를 태그별로 넣어둔다.
  const [openGroups, setOpenGroups] = useAtom(openGroupsAtom);

  if (todoList.length === 0) return null;

  const groupBy = (list) => {
    const tagGroups = new Map();
    const noTagGroup = [];
    const completedGroup = [];

    list.forEach((task) => {
      if (task.is_completed) {
        completedGroup.push(task);
      } else {
        // 태그가 , 으로 나누어져 있어 이를 분리해주는 코드
        const firstTag = task.tagName?.split(",")[0]?.trim();
        if (firstTag) {
          if (!tagGroups.has(firstTag)) {
            // 태그가 처음 등장하면 새로운 배열을 생성
            tagGroups.set(firstTag, []);
          }
          tagGroups.get(firstTag).push(task);
        } else {
          noTagGroup.push(task);
        }
      }
    });

    // 최종 배열을 넣어줄 곳
    const result = [];

    // 순서대로 배치하기 위해 3가지로 나눔
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

  //빈 리스트를 걸러주기 위한 필터링
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

  //태그 정렬인지 기본 정렬인지에 따라 배열을 달리 해주는 것
  const groupedList =
    witchGroup === "태그 정렬"
      ? groupBy(todoList)
      : filterAllList(todoList);

  // 토글에 대한 상태 관리
  // tag : true 처럼 되어있고 배열에 없는 것은 false로 초기화 된다.
  const toggleGroup = (tag) => {
    setOpenGroups((prev) => ({
      ...prev,
      [tag]: !prev[tag],
    }));
  };

  return (
    <div>
      {groupedList.map((group) => {
        const isToggleOpen = openGroups[group.tag] ?? true; // 기본: 열림 상태 값이 없으면 true를 기본 값으로 함
        return (
          <div key={group.tag}>
            <section className="flex items-center mt-[0.69rem] mb-[0.69rem]">
              <button
                className="mr-[0.44rem]"
                onClick={() => toggleGroup(group.tag)}
              >
                <img
                  src={arrowBtn}
                  className={`h-[1rem] w-[1rem] transition-transform duration-300 ${
                    isToggleOpen ? "rotate-0" : "rotate-180"
                  }`}
                  alt="toggle"
                />
              </button>
              <span className="text-[0.55444rem] text-[#656565] font-[Inter] font-normal">
                {group.tag}
              </span>
              <div className="flex-grow h-[0.04619rem] bg-[#ABABAB] max-w-[14.33019rem] mx-[0.44rem]" />
            </section>
            {/* 토글 상태에 따라 열고 닫는걸 관리한다. */}
            {isToggleOpen &&
              group.task.map((task) => (
                <TodoItem
                  key={task.id}
                  task={task}
                  checked={task.is_completed}
                />
              ))}
          </div>
        );
      })}
    </div>
  );
}

export default TodoCategory;
