import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import bookImg from "../assets/logo/book_square.svg";
import SideBtn from "./SideBtn";
import StudyPlanBtn from "./studyPlan/StudyPlanBtn";
import ChatbotBtn from "./chatbot/ChatbotBtn";

const SideBox = () => {
  const nav = useNavigate();
  const location = useLocation();

  // URL 경로 기반으로 현재 선택된 버튼 판단
  const getSelected = () => {
    if (location.pathname.startsWith("/timetable")) return "timetable";
    if (location.pathname.startsWith("/tag")) return "tag";
    if (location.pathname.startsWith("/clock")) return "clock";
    if (location.pathname.startsWith("/setting")) return "setting";
    if (location.pathname.startsWith("/")) return "calendar";
    // calender는 마직막에 와야 한다. 위에서 부터 차근차근 비교하는데 무조건 /로 시작하기 때문에 마지막에 검사
    return ""; // 기본값
  };

  const selected = getSelected();

  // 버튼 클릭 시 페이지 이동
  const handleClick = (type) => {
    switch (type) {
      case "calendar":
        nav("/");
        break;
      case "tag":
        nav("/"); // 나중에 구현 예정
        break;
      case "clock":
        nav("/"); // 나중에 구현 예정
        break;
      case "setting":
        nav("/settings/profile");
        break;
      case "timetable":
        nav("/timetable");
        break;
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F3E0] w-[11.75rem] min-w-[10rem] p-[1.25rem]">
      <section className="flex justify-center items-center gap-[0.25rem]">
        <img className="w-[1.86506rem] h-[1.86506rem]" src={bookImg} />
        <button
          className="text-[#010669] text-[1.49206rem] font-[Josefin Sans] font-semibold"
          onClick={() => nav("/")}
        >
          Schedulo
        </button>
      </section>

      <section className="flex flex-col gap-[1.11906rem] mt-[2.41rem]">
        {["calendar", "tag", "clock", "setting", "timetable"].map((type) => (
          <SideBtn
            key={type}
            type={type}
            isActive={selected === type}
            onClick={() => handleClick(type)}
          />
        ))}
      </section>

      <section className="flex flex-col items-center gap-[1rem] mt-[9rem]">
        <StudyPlanBtn />
        <ChatbotBtn />
      </section>
    </div>
  );
};

export default SideBox;
