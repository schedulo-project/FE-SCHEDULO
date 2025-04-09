import React, { useEffect, useState } from "react";
import GetCookie from "../lib/GetCookie";

const Logindata = await GetCookie();
const token = Logindata.access;

const AddWidget = ({ state }) => {
  const [refactorAddData, setRefactorAddData] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false); // 버튼 클릭 후 상태를 관리하기 위한 state
  const actions = state.actions;

  // refactorAddData 관리
  useEffect(() => {
    const lastMessage =
      state.messages[state.messages.length - 1];

    if (lastMessage?.widgetProps?.scheduleData) {
      // scheduleData가 존재하면 상태에 저장
      setRefactorAddData(lastMessage.widgetProps.scheduleData);
    }
  }, [state.messages]); // state.messages가 변경될 때마다 실행

  // 일정 추가
  const AddSchedule = async () => {
    console.log("refactorAddData", refactorAddData);
    const TagArr = await SplitTag(refactorAddData.tag);
    try {
      const response = await fetch(
        "http://13.124.140.60/schedules/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: refactorAddData.details,
            content: refactorAddData.details,
            scheduled_date: refactorAddData.date,
            tag: TagArr, // 생성된 태그 ID 사용
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text(); // 서버 응답 메시지 확인
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorText}`
        );
      }

      const createdData = await response.json();
      console.log("일정 생성 성공:", createdData);
    } catch (error) {
      console.error("일정 생성 실패:", error);
    }
  };

  // 일정 추가 진행
  const handleAdd = () => {
    AddSchedule(); // 일정 등록
    actions.handleAddRequest(); // actionProvider 메서드를 호출하여 행동 트리거
    setIsDisabled(true); // '추가' 버튼을 비활성화
  };

  // 일정 추가 취소
  const handleCancel = () => {
    actions.handleCancel(); // 챗봇에 메시지 추가
    setIsDisabled(true); // '취소' 버튼을 비활성화
  };

  return (
    <div style={{ display: "flex", gap: "10px" }}>
      <button onClick={handleAdd} disabled={isDisabled}>
        추가
      </button>
      <button onClick={handleCancel} disabled={isDisabled}>
        취소
      </button>
    </div>
  );
};
function SplitTag(tagStr) {
  if (tagStr === "전체") {
    return [];
  } else if (tagStr.includes(",")) {
    return tagStr.split(",").map((tag) => tag.trim());
  } else {
    return [tagStr.trim()];
  }
}

export default AddWidget;
