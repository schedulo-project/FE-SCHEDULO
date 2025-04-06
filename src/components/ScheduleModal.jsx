//isModalOpen : 모달이 열렸는지 아닌지 판단하는 boolean 값
// data : 모달에 보여줄 데이터
// setIsModalOpen : 모달을 열고 닫는 함수 useState로 관리
// onChange : 모달에서 일정 수정 시 사용될 함수 - home에 있는 handleChange와 연결
// onChange는 추후에 수정기능이 만들어지면 사용할 예정
import React from "react";
import xImg from "../assets/src/x_sign.svg";
import trashImg from "../assets/src/trash.svg";
const ScheduleModal = ({
  isModalOpen,
  data,
  setIsModalOpen,
  onChange,
}) => {
  if (!isModalOpen) return null;
  const handleClose = () => {
    setIsModalOpen(false);
  };

  const handleDateClick = () => {
    console.log("지움");
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50"
      onClick={handleClose}
    >
      <div className="w-[27.375rem] h-[36.8125rem] bg-white rounded-[1rem]">
        <section className="bg-[#010669] flex h-[5rem] p-[1.5625rem] justify-between items-center rounded-t-[1rem]">
          <span className="text-white text-[1.25rem] font-normal font-[Noto Sans KR]">
            일정 상세표
          </span>
          <button onClick={handleClose}>
            <img className="w-[0.625rem] h-[0.62494rem]" src={xImg} />
          </button>
        </section>
        <section>
          <span>{data.title}</span>
          <button onClick={handleDateClick}>
            <img src={trashImg} />
          </button>
        </section>
      </div>
    </div>
  );
};

export default ScheduleModal;
