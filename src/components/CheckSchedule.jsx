import { useState, useEffect } from "react";
import TodoCategory from "../components/TodoCategory";
import { useAtom } from "jotai";
import { homeSidebarAtoms } from "../atoms/HomeAtoms";

import DropDown from "./DropDown";

function CheckSchedule({ selectedDateEvents }) {
  const [todoList, setTodoList] = useState([]);
  const [isSidebarOpen, setSidebarOpen] =
    useAtom(homeSidebarAtoms);

  useEffect(() => {
    if (selectedDateEvents && selectedDateEvents.length > 0) {
      setTodoList(selectedDateEvents);
    }
  }, [selectedDateEvents]);

  //self-center leading-non는 애매하게 정렬이 안되는 x를 위해 사용함
  const exitButton = (
    <div>
      <button
        onClick={() => setSidebarOpen(false)}
        className="text-gray-500 text-xl static lg:hidden self-center leading-none"
      >
        ✕
      </button>
    </div>
  );

  if (selectedDateEvents.length === 0) {
    return (
      <div
        className="flex justify-between pt-[0.75rem] pb-[0.75rem] pr-[0.8125rem] pl-[0.8125rem] 
                bg-[#F0F0F0] rounded-[0.294rem] border-[#E0E0E0] 
                border-4 w-full h-[500px] min-h-[26.1875rem]"
      >
        <span className="text-[#1A1A1A] text-[0.73925rem] font-semibold font-[Inter]">
          일정이 없습니다.
        </span>

        {isSidebarOpen && exitButton}
      </div>
    );
  }

  return (
    <div
      className="pt-[0.75rem] pb-[0.75rem] pr-[0.8125rem] pl-[0.8125rem] 
                bg-[#F0F0F0] rounded-[0.294rem] border-[#E0E0E0] 
                border-4 w-full h-[500px] min-h-[26.1875rem] overflow-auto"
    >
      <section className="flex justify-between items-center">
        <span className="text-[#1A1A1A] text-[0.73925rem] font-semibold font-[Inter]">
          일정
        </span>
        <span className="text-[#010669] text-[10px] font-semibold font-[Inter] flex items-center gap-2">
          {selectedDateEvents[0].date}
          {selectedDateEvents[0].deadline &&
            selectedDateEvents[0].deadline !==
              selectedDateEvents[0].date &&
            ` ~ ${selectedDateEvents[0].deadline}`}
          <DropDown />
          {/* 드롭다운 컴포넌트 */}

          {isSidebarOpen && exitButton}
        </span>
      </section>
      <section>
        <TodoCategory todoList={todoList} />
      </section>
    </div>
  );
}

export default CheckSchedule;
