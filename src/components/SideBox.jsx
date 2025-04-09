import React, { useState } from "react";
import bookImg from "../assets/src/book_square.svg";
import SideBtn from "./SideBtn";
import ChatbotBtn from "./ChatbotBtn";

const SideBox = () => {
  const [selected, setSelected] = useState("calendar");

  return (
    <div className="min-h-screen bg-[#F3F3E0] w-[11.75rem] min-w-[10rem] p-[1.25rem] ">
      <section className="flex justify-center items-center gap-[0.25rem]">
        <img
          className="w-[1.86506rem] h-[1.86506rem]"
          src={bookImg}
        />
        <span className="text-[#010669] text-[1.49206rem] font-[Josefin Sans] font-semibold">
          Schedulo
        </span>
      </section>
      <section className="flex flex-col gap-[1.11906rem] mt-[2.41rem]">
        {["calendar", "tag", "clock", "setting"].map((type) => (
          <SideBtn
            key={type}
            type={type}
            isActive={selected === type}
            onClick={() => setSelected(type)}
          />
        ))}
      </section>
      <section className="flex justify-center items-center mt-[9rem]">
        <ChatbotBtn />
      </section>
    </div>
  );
};

export default SideBox;
