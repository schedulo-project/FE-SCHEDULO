//isModalOpen : 모달이 열렸는지 아닌지 판단하는 boolean 값
// data : 모달에 보여줄 데이터
// setIsModalOpen : 모달을 열고 닫는 함수 useState로 관리
// onChange : 모달에서 일정 수정 시 사용될 함수 - home에 있는 handleChange와 연결
// onChange는 추후에 수정기능이 만들어지면 사용할 예정
import React, { useRef, useState } from "react";
import TagBox from "./TagBox";
import getTodayString from "../utils/getTodayString";

//jotai
import { useAtom } from "jotai";
import { handleChangeAtom } from "../atoms/HomeAtoms";

//이미지
import xImg from "../assets/schedulemodal/x_sign.svg";
import trashImg from "../assets/schedulemodal/trash.svg";
import calendarImg from "../assets/schedulemodal/calendar_search.svg";
import deleteSchedules from "../api/deleteScheduleApi";

import Select from "react-select";

const tagOptions = [
  { value: "강의", label: "강의" },
  { value: "취미", label: "취미" },
  { value: "학교공부", label: "학교공부" },
  { value: "개인공부", label: "개인공부" },
  { value: "회의", label: "회의" },
];

const ScheduleModal = ({
  isModalOpen,
  data,
  setIsModalOpen,
}) => {
  //jotai
  const [, sethandleChange] = useAtom(handleChangeAtom);

  const today = getTodayString();

  // 오늘 날짜
  const [todayDate, setTodayDate] = useState(today);

  const dateInputRef = useRef(null);

  // 선택된 태그들 상태로 관리
  const [selectedTags, setSelectedTags] = useState([]);

  if (!isModalOpen) return null;
  const handleClose = () => {
    setIsModalOpen(false);
    setTodayDate(today); // 모달 창 꺼질 때 오늘 일정으로 초기화
    // sethandleChange({ data: null, id }); 추가해야함
  };

  // 일정 삭제
  const handleTrashClick = async (id) => {
    // 삭제할 일정의 id를 받아 일정 삭제 api에 전달
    try {
      await deleteSchedules(id);
      alert("삭제가 성공적으로 완료되었습니다.");
      sethandleChange({ data: null, id });
      // 삭제된 일정의 id 전달, 부모 컴포넌트에서 events 상태 업데이트
      setIsModalOpen(false);
    } catch (error) {
      console.error("삭제 중 오류 발생", error);
      alert("삭제에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const size =
    "min-w-[4.8125rem] text-[0.90238rem] pr-[1.80469rem] pl-[1.80469rem] pt-[0.15038rem] pb-[0.15038rem]";

  if (data.id === null) {
    const handleDateChange = (e) => {
      setTodayDate(e.target.value);
      // setShowDateInput(false);
    };

    // 모달 창 닫을 시
    // const handleOffModal = () => {
    //   setTodayDate(now);
    // };

    return (
      <div
        className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
        onClick={handleClose}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="flex flex-col justify-between items-center w-[27.375rem] h-[36.8125rem] bg-white rounded-[1rem]"
        >
          <section className="bg-[#010669] flex w-full h-[5rem] p-[1.5625rem] justify-between items-center rounded-t-[1rem]">
            <span className="text-white text-[1.25rem] font-normal font-[Noto Sans KR]">
              일정 추가하기
            </span>
            {/* 일정 추가 모달 종료 */}
            <button onClick={handleClose}>
              <img
                className="w-[0.625rem] h-[0.62494rem]"
                src={xImg}
              />
            </button>
          </section>

          <section className="flex flex-col items-center justify-center w-full">
            {/* 일정 제목 */}
            <section className="flex w-[80%] justify-between items-center">
              <span className="text-[#1A1A1A] text-[1.5625rem] font-semibold font-[Inter] text-center">
                <input
                  type="text"
                  id="title"
                  placeholder="일정 제목을 입력하세요"
                  className=" placeholder:text-xl"
                />
              </span>
            </section>

            {/* 일정 태그 선택 */}
            <section className="w-[80%] flex justify-start items-center mt-[0.85rem]">
              <Select
                isMulti // 다중 선택 가능
                name="tags" // input의 name 속성
                options={tagOptions} // select 목록
                className="basic-multi-select w-[3=40%]"
                classNamePrefix="select"
                value={selectedTags} // 현재 선택된 값
                onChange={setSelectedTags}
                placeholder="태그 선택"
              />
            </section>
          </section>

          {/* 일정 날짜 + 일정 내용 */}
          <section className="w-[98%] h-[21.125rem] bg-[#F0F0F0] rounded-[1rem] mb-[1%] p-[2rem] flex flex-col">
            {/* 일정 날짜 */}
            <section className="flex justify-start items-center mb-1 gap-2">
              <span className=" text-[#1A1A1A] text-[1.25rem] font-semibold font-[Inter] pt-[0.25rem]">
                {todayDate}
              </span>
              {/* 일정 선택 */}
              <button className="w-[1.3125rem] h-[1.3125rem] relative">
                <img src={calendarImg} />
                <input
                  ref={dateInputRef}
                  type="date"
                  value={todayDate}
                  onChange={handleDateChange}
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    opacity: 0,
                    width: "100%",
                    height: "100%",
                  }}
                />
              </button>
            </section>

            {/* 일정 내용 */}
            <section className="border-t-[0.0625rem] border-[#ABABAB] mt-[0.0625rem] mb-[1rem]"></section>
            <span className="text-[#656565]">
              <textarea
                type="text"
                placeholder="일정 내용을 입력하시오"
                className="bg-transparent resize-none w-[100%] h-[200px]"
              />
            </span>
          </section>
        </div>
      </div>
    );
  }
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col justify-between items-center w-[27.375rem] h-[36.8125rem] bg-white rounded-[1rem]"
      >
        <section className="bg-[#010669] flex w-full h-[5rem] p-[1.5625rem] justify-between items-center rounded-t-[1rem]">
          <span className="text-white text-[1.25rem] font-normal font-[Noto Sans KR]">
            일정 상세표
          </span>
          <button onClick={handleClose}>
            <img
              className="w-[0.625rem] h-[0.62494rem]"
              src={xImg}
            />
          </button>
        </section>

        <section className="flex flex-col items-center justify-center w-full">
          <section className="flex w-[80%] justify-between items-center">
            <span className="text-[#1A1A1A] text-[1.5625rem] font-semibold font-[Inter] text-center">
              {data.title}
            </span>
            <button
              className="w-[1.5rem] h-[1.5rem]"
              onClick={() => handleTrashClick(data.id)}
            >
              <img src={trashImg} />
            </button>
          </section>
          <section className="w-[80%] flex justify-start items-center mt-[0.85rem]">
            <TagBox tagNames={data.tagName} size={size} />
          </section>
        </section>

        <section className="w-[98%] h-[21.125rem] bg-[#F0F0F0] rounded-[1rem] mb-[1%] p-[2rem] flex flex-col">
          <section className="flex justify-start items-center mb-1 gap-1">
            <span className=" text-[#1A1A1A] text-[1.25rem] font-semibold font-[Inter] pt-[0.25rem]">
              {data.date}
            </span>
            <button className="w-[1.3125rem] h-[1.3125rem]">
              <img src={calendarImg} />
            </button>
          </section>
          <section className="border-t-[0.0625rem] border-[#ABABAB] mt-[0.0625rem] mb-[1rem]"></section>
          <span className="text-[#656565]">{data.content}</span>
        </section>
      </div>
    </div>
  );
};

export default ScheduleModal;
