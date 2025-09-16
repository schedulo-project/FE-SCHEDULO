import React, { useState, useRef, useEffect } from "react";
import groupbtn from "../assets/checkschedule/group_change_btn.svg";

import { useAtom } from "jotai";
import { WitchGroupAtom } from "../atoms/HomeAtoms";

const DropDown = () => {
  const [isDropDownOpen, setDropDownOpen] = useState(false);
  const ref = useRef(null);

  // jotai를 사용하여 witchGroup 상태를 관리
  // 기본 정렬과 태그 정렬 중 무엇을 선택했는지 확인하기 위해 사용
  const [witchGroup, setWitchGroup] = useAtom(WitchGroupAtom);

  const optionArr = ["태그 정렬", "기본 정렬"];

  const openDropdown = () => {
    setDropDownOpen(!isDropDownOpen);
  };

  useEffect(() => {
    //컴포넌트 외부를 클릭 했을 때 드롭다운 닫기
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setDropDownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [ref]);

  return (
    <div ref={ref} className="relative mt-[0.2rem]">
      <button onClick={openDropdown}>
        <img src={groupbtn} alt="드롭다운 열기" />
      </button>
      {isDropDownOpen && (
        <div className="absolute right-0 w-20 bg-white rounded-lg overflow-hidden border border-gray-300 shadow-sm">
          {optionArr.map((option, index) => (
            <div
              key={index}
              className={`pl-3 py-2 hover:bg-[#DDE6ED] cursor-pointer ${
                witchGroup === option ? " bg-blue-50 " : ""
              }`}
              onClick={() => {
                setWitchGroup(option);
                // 선택된 옵션에 따라 witchGroup 상태 업데이트
                setDropDownOpen(false);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropDown;
