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
      <h3 className="font-bold text-xl mb-4">수정할 일정</h3>
      {Object.entries(refactorData).map(([date, items]) => (
        <div key={date} className="mb-4">
          <h4 className="font-semibold text-lg mb-2">{date}</h4>
          <div>
            {items.map((item, index) => (
              <div
                key={index}
                className={`flex items-center justify-between bg-[#F0F0F0] border-[#E0E0E0] border-4 rounded-md p-2 mb-2`}
              >
                <section>
                  <span className="text-sm text-[#1A1A1A] font-semibold font-inter">
                    {item.title}
                  </span>
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
                <EditButton
                  date={date}
                  category={item.tag} // 태그 전달
                  item={item} // 일정 데이터 전달
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default EditWidget;
