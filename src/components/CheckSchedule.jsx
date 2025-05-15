import { useState, useEffect } from "react";
import TodoCategory from "../components/TodoCategory";
import { useAtom } from "jotai";
import { homeSidebarAtoms } from "../atoms/HomeAtoms";

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
                border-4 w-80 max-w-[17.34519rem] min-h-[26.1875rem]"
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
                border-4 w-80 max-w-[17.34519rem] min-h-[26.1875rem] max-h-[40.1875rem] overflow-scroll"
    >
      <section className="flex justify-between items-end">
        <span className="text-[#1A1A1A] text-[0.73925rem] font-semibold font-[Inter]">
          일정
        </span>
        <span className="text-[#010669] text-[0.625rem] font-semibold font-[Inter] flex items-center gap-2">
          {selectedDateEvents[0].date}

          {isSidebarOpen && exitButton}
        </span>
      </section>
      <section className="flex items-center mt-[0.69rem] mb-[0.69rem]">
        <span className="text-[0.55444rem] text-[#656565] font-[Inter] font-normal">
          todo
        </span>
        <div className="flex-grow h-[0.04619rem] bg-[#ABABAB] max-w-[13.95906rem] mx-[0.44rem]" />
      </section>
      <section>
        <TodoCategory todoList={todoList} />
      </section>
    </div>
  );
}

export default CheckSchedule;
