import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import bookImg from "../assets/logo/book_square.svg";
import SideBtn from "./SideBtn";
import StudyPlanBtn from "./studyPlan/StudyPlanBtn";
import ChatbotBtn from "./chatbot/ChatbotBtn";

const SideBox = ({ closeSidebar }) => {
  const nav = useNavigate();
  const location = useLocation();

  const getSelected = () => {
    if (location.pathname.startsWith("/timetable")) return "timetable";
    if (location.pathname.startsWith("/tag")) return "tag";
    if (location.pathname.startsWith("/clock")) return "clock";
    if (location.pathname.startsWith("/setting")) return "setting";
    if (location.pathname.startsWith("/")) return "calendar";
    return "";
  };

  const selected = getSelected();

  const handleClick = (type) => {
    switch (type) {
      case "calendar":
        nav("/");
        break;
      case "tag":
      case "clock":
        nav("/"); // 구현 예정
        break;
      case "setting":
        nav("/settings/profile");
        break;
      case "timetable":
        nav("/timetable");
        break;
    }
    if (closeSidebar) closeSidebar(); // 모바일에서 닫기
  };

  return (
    <div className="min-h-screen bg-[#DDE6ED] w-[11.75rem] min-w-[10rem] p-[1.25rem]">
      {/* 사이드바 닫기 버튼  768px 아래로 내려가면 나옴 */}
      <div className="flex justify-end lg:hidden ">
        <button onClick={closeSidebar} className="text-l">
          ✕
        </button>
      </div>

      <section className="flex justify-center items-center gap-[0.25rem]">
        <img
          className="w-[1.86506rem] h-[1.86506rem] hidden lg:block"
          src={bookImg}
        />

        <button
          className="text-[#27374D] text-[1.49206rem] font-[Josefin Sans] font-semibold hidden lg:block"
          onClick={() => nav("/")}
        >
          Schedulo
        </button>
      </section>

      <section className="flex flex-col items-center gap-[1.11906rem] mt-[2.41rem]">
        {["calendar", "tag", "clock", "timetable", "setting"].map((type) => (
          <SideBtn
            key={type}
            type={type}
            isActive={selected === type}
            onClick={() => handleClick(type)}
          />
        ))}
      </section>

      <section className="flex flex-col items-center gap-[1rem] mt-[2.5rem]">
        <StudyPlanBtn />
        <ChatbotBtn />
      </section>
    </div>
  );
};

export default SideBox;
