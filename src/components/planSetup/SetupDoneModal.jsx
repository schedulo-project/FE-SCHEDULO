import React from "react";
import { useNavigate } from "react-router-dom";

const SetupDoneModal = () => {
  const navigate = useNavigate();

  const goToHome = () => {
    localStorage.setItem("planSetupCompleted", "true");
    navigate("/");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-10 shadow-lg w-[500px] text-center">
        <h2 className="text-2xl font-bold text-[#27374D] mb-4">
          🎉 완료되었습니다!
        </h2>
        <p className="text-gray-700 text-base mb-6">
          입력해주신 공부 스타일을 기반으로 <br />
          Schedulo가 더 스마트한 일정을 제안할게요.
        </p>
        <button
          onClick={goToHome}
          className="bg-[#27374D] h-[68px] w-full text-lg text-white px-6 py-3 rounded-3xl font-semibold hover:bg-[#8BA3B0] transition"
        >
          홈으로 가기
        </button>
      </div>
    </div>
  );
};

export default SetupDoneModal;
