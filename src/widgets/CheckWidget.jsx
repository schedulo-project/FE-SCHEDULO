import React, { useState, useEffect } from "react";

const CheckWidget = ({ state }) => {
  const [scheduleData, setScheduleData] = useState([]);
  // console.log("state", state);
  useEffect(() => {
    const lastMessage = state.messages[state.messages.length - 1];

    if (lastMessage?.widgetProps?.scheduleData?.schedules) {
      // 만약 schedules가 있으면 로컬 상태에 저장
      setScheduleData(lastMessage.widgetProps.scheduleData.schedules);
    }
  }, [setScheduleData]); // state.messages가 변경될 때마다 실행

  // if (scheduleData.length === 0) {
  //   return <div>일정 데이터를 로딩 중...</div>; // 데이터가 없으면 로딩 상태 표시
  // }
  if (!scheduleData || Object.keys(scheduleData).length === 0) {
    return <div>일정이 없습니다.</div>;
  }

  return (
    <div>
      <h3>조회된 일정</h3>
      {Object.entries(scheduleData).map(([key]) => (
        <div key={key}>
          <h4>{key}</h4>
          <ul>
            {scheduleData[key].map((item, index) => (
              <li key={index}>
                <strong>{item.title}</strong>
                <p>{item.content}</p>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default CheckWidget;
