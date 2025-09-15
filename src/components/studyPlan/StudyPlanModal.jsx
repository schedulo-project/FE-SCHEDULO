import React from "react";
import ReactDOM from "react-dom";
import { useNavigate } from "react-router-dom";
import planImage from "../../assets/studyplan/planimage.jpg";

const StudyPlanModal = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/studyplan/setup");
  };

  const modalContent = (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-[9999] flex items-center justify-center">
      <div
        className="bg-white rounded-3xl p-6 shadow-lg w-[500px] text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={planImage}
          alt="공부 습관 이미지"
          className="h-[150px] w-full object-cover rounded-2xl mb-6"
        />
        <h2 className="text-3xl font-bold mb-4 text-[#27374D]">
          공부 습관 등록
        </h2>
        <p className="text-gray-700 text-base leading-relaxed mb-6">
          Schedulo에서 효율적으로 시간 관리를 해드리기 위해
          <br />
          사전에 공부 스타일을 받아보고 있습니다! <br />
          (추후, 설정에서 변경 혹은 수정 가능합니다)
        </p>

        <button
          onClick={handleStart}
          className="bg-[#27374D] h-[68px] w-full text-lg text-white px-6 py-3 rounded-3xl font-semibold hover:bg-[#8BA3B0] transition"
        >
          등록하러 가기
        </button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, document.body);
};

export default StudyPlanModal;
