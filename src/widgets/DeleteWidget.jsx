import React, { useState, useEffect } from "react";
import GetCookie from "../api/GetCookie";

const Logindata = await GetCookie();
const token = Logindata.access;

const DeleteWidget = ({ state }) => {
  const [scheduleData, setScheduleData] = useState({});
  const [checked, setChecked] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] =
    useState(false); // 버튼 비활성화 상태
  const actions = state.actions;

  useEffect(() => {
    const lastMessage =
      state.messages[state.messages.length - 1];

    if (lastMessage?.widgetProps?.scheduleData) {
      setScheduleData(lastMessage.widgetProps.scheduleData);
    }

    // 새로운 데이터가 들어오면 체크 상태 초기화
    setChecked([]);
    setIsButtonDisabled(false); // 데이터 변경 시 버튼 다시 활성화
  }, [setScheduleData]); // state.messages가 변경될 때 실행

  // 체크박스를 클릭할 때 호출되는 함수
  const handleCheck = (scheduleId) => {
    setChecked((prevChecked) =>
      prevChecked.includes(scheduleId)
        ? prevChecked.filter((id) => id !== scheduleId)
        : [...prevChecked, scheduleId]
    );
  };

  // 삭제 버튼 클릭 시 처리할 함수
  const handleDelete = () => {
    if (checked.length === 0) {
      alert("삭제할 항목을 선택하세요.");
      return;
    }
    DeleteSchedules({ data: checked, token });
    setIsButtonDisabled(true); // 버튼 비활성화
    console.log("삭제할 항목들:", checked);

    // 실제 삭제 로직 추가 가능
  };

  // 취소 버튼 클릭 시 처리할 함수
  const handleCancel = () => {
    setChecked([]);
    setIsButtonDisabled(true); // 버튼 비활성화

    if (actions?.handleCancel) {
      actions.handleCancel();
    }
  };

  if (!scheduleData || Object.keys(scheduleData).length === 0) {
    return <div>삭제할 일정이 없습니다.</div>;
  }

  return (
    <div>
      <strong>삭제할 일정</strong>
      {Object.keys(scheduleData).map((date) => (
        <div key={date}>
          <h4>{date}</h4>
          {scheduleData[date].map((item) => (
            <div key={item.id}>
              <label>
                <input
                  type="checkbox"
                  value={item.id}
                  checked={checked.includes(item.id)}
                  onChange={() => handleCheck(item.id)}
                  disabled={isButtonDisabled}
                />
                {item.title} :<p>{item.content}</p>
              </label>
            </div>
          ))}
        </div>
      ))}

      <div
        style={{
          marginTop: "40px",
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={handleDelete}
          disabled={isButtonDisabled}
        >
          삭제
        </button>
        <button
          onClick={handleCancel}
          disabled={isButtonDisabled}
        >
          취소
        </button>
      </div>
    </div>
  );
};

const DeleteSchedules = async ({ data, token }) => {
  try {
    const response = await fetch(
      "http://13.124.140.60/schedules/",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ids: data }),
      }
    );

    console.log("Response Status:", response.status);

    // ✅ 204 No Content → 성공 처리 후 종료
    if (response.status === 204) {
      console.log("✅ 삭제 성공 (204 No Content)");
      return actions.handleDeleteRequest();
    }

    // ❌ 204가 아니면 무조건 에러 처리
    const errorText = `요청 실패: HTTP ${response.status}`;
    console.error(errorText);
    return actions.handleError();
  } catch (error) {
    console.error("백엔드 오류:", error);
    return actions.handleError();
  }
};

export default DeleteWidget;
