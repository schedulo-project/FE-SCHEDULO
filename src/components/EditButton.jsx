import React from "react";
// import { useHistory } from "react-router-dom";

const EditButton = ({ date, category, item }) => {
  const handleEditClick = () => {
    console.log("수정할 일정:", item);
    // 일정 수정 컴포넌트 들어올 자리
    // - 일정 수정 컴포넌트에서 일정 수정 api 호출
  };

  return (
    <button
      className="border-1 border-black"
      onClick={handleEditClick}
    >
      수정하기
    </button>
  );
};

export default EditButton;
