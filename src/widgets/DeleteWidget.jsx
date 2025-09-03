import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const DeleteWidget = ({ state }) => {
  const { accessToken } = useAuth();
  const [scheduleData, setScheduleData] = useState({});
  const [checked, setChecked] = useState([]);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false); // 버튼 비활성화 상태
  const actions = state.actions;

  useEffect(() => {
    const lastMessage = state.messages[state.messages.length - 1];

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
    DeleteSchedules({ data: checked, token, actions: actions });
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
      <h3 className="font-bold text-xl mb-4">삭제할 일정</h3>
      {Object.entries(scheduleData).map(([date, items]) => (
        <div key={date} className="mb-4">
          <h4 className="font-semibold text-lg mb-2">{date}</h4>
          <div>
            {items.map((item) => (
              <div
                key={item.id}
                className={`flex items-center justify-between bg-[#F0F0F0] border-[#E0E0E0] border-4 rounded-md p-2 mb-2`}
              >
                <section>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={item.id}
                      checked={checked.includes(item.id)}
                      onChange={() => handleCheck(item.id)}
                      disabled={isButtonDisabled}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-[#1A1A1A] font-semibold font-inter">
                      {item.title}
                    </span>
                  </label>

                  {/* 태그가 있다면 아래처럼 표시 */}
                  {item.tag &&
                    Array.isArray(item.tag) &&
                    item.tag.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {item.tag.map((tag, i) => (
                          <span
                            key={i}
                            className="inline-block bg-[#e0e0e0] rounded px-2 py-0.5 text-xs"
                          >
                            {tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                </section>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="flex gap-[50px] justify-center">
        <button
          onClick={handleDelete}
          disabled={isButtonDisabled}
          className="w-[60px] h-7 text-3 leading-3 text-white bg-gray-600 border border-black rounded-2xl "
        >
          삭제
        </button>
        <button
          onClick={handleCancel}
          disabled={isButtonDisabled}
          className="w-[60px] h-7 text-3 leading-3 bg-white border border-gray-600 rounded-2xl"
        >
          취소
        </button>
      </div>
    </div>
  );
};

const DeleteSchedules = async ({ data, token, actions }) => {
  try {
    const response = await fetch(`${baseURL}/schedules/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ ids: data }),
    });

    console.log("Response Status:", response.status);

    // ✅ 204 No Content → 성공 처리 후 종료
    if (response.status === 204) {
      console.log("✅ 삭제 성공 (204 No Content)");
      console.log("삭제된 항목들:", actions);
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
