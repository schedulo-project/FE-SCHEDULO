import { useState, useEffect } from "react";
import TodoCategory from "../components/TodoCategory";
import ScheduleAddBtn from "../components/ScheduleAddBtn";
import GetCookie from "../lib/GetCookie";

function CheckSchedule({ selectedEvents, onCheck, onChange }) {
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    if (selectedEvents && selectedEvents.length > 0) {
      setTodoList(selectedEvents);
    }
  }, [selectedEvents]);

  const handleCheck = async (id) => {
    // 1. 변경될 task를 찾고, 상태 반전
    const prevTask = todoList.find((task) => task.id === id);
    if (!prevTask) return;

    const updatedTask = {
      ...prevTask,
      is_completed: !prevTask.is_completed,
    };

    // 2. 리스트 상태 업데이트
    setTodoList((prev) =>
      prev.map((task) => (task.id === id ? updatedTask : task))
    );

    // 3. API 호출 (체크 상태 반영)
    console.log("updatedTask : ", updatedTask);
    // 4. 콜백 실행
    await ScheduleCompleteOrNot({ data: updatedTask });

    onCheck(id);
  };
  if (selectedEvents.length === 0) {
    return (
      <div
        className="flex justify-center pt-[0.75rem] pb-[0.75rem] pr-[0.8125rem] pl-[0.8125rem] 
                bg-[#F0F0F0] rounded-[0.294rem] border-[#E0E0E0] 
                border-4 w-80 max-w-[17.34519rem] min-h-[26.1875rem]"
      >
        <span className="text-[#1A1A1A] text-[0.73925rem] font-semibold font-[Inter]">
          일정이 없습니다.
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
          onChange={onChange}
        />
      </section>
    </div>
  );
}

const ScheduleCompleteOrNot = async ({ data }) => {
  const Logindata = await GetCookie();
  const token = Logindata.access;
  const tagNames = data.tagName;

  const tags = (await tagNames)
    ? tagNames.split(",").map((tag) => tag.trim())
    : [];

  const id = `${data.id}/`;

  try {
    const response = await fetch(
      `http://13.124.140.60/schedules/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: data.title,
          content: data.content,
          scheduled_date: data.date,
          tag: tags,
          deadline: data.deadline,
          is_completed: data.is_completed,
        }), // ExData를 서버로 전송
      }
    );

    const ExCheckData = await response.json();
    // 서버에서 받은 응답을 처리
    console.log("ExCheckData : ", ExCheckData);
    return ExCheckData;
  } catch (error) {
    console.error("백엔드 오류:", error);
    return null; // 오류 발생 시 null 반환
  }
};

export default CheckSchedule;
