import React, { useState, useEffect } from "react";
import EditButton from "../components/EditButton";

const EditWidget = ({ state }) => {
  const [refactorData, setRefactorData] = useState({});

  useEffect(() => {
    const lastMessage =
      state.messages[state.messages.length - 1];

    if (lastMessage?.widgetProps?.scheduleData) {
      // scheduleData가 존재하면 상태에 저장
      setRefactorData(lastMessage.widgetProps.scheduleData);
    }
  }, [setRefactorData]); // state.messages가 변경될 때마다 실행

  // 데이터가 없으면 메시지 표시
  if (!refactorData || Object.keys(refactorData).length === 0) {
    return <div>수정할 일정이 없습니다.</div>;
  }

  return (
    <div>
      <strong>수정할 일정</strong>
      {Object.keys(refactorData).map((date) => (
        <div key={date}>
          <strong>{date}</strong>
          <ul>
            {refactorData[date].map((item, index) => (
              <li className="flex justify-between" key={index}>
                <div>
                  <strong>제목:</strong> {item.title} <br />
                  <strong>내용:</strong> {item.content} <br />
                  <br />
                </div>
                <EditButton
                  date={date}
                  category={item.tag} // 태그 전달
                  item={item} // 일정 데이터 전달
                />
              </li>
            ))}
          </ul>
          <hr />
        </div>
      ))}
    </div>
  );
};

export default EditWidget;
