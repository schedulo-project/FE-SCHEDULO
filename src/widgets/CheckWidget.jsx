import { useState, useEffect } from "react";

const CheckWidget = ({ state }) => {
  const [scheduleData, setScheduleData] = useState([]);
  useEffect(() => {
    const lastMessage =
      state.messages[state.messages.length - 1];

    if (lastMessage?.widgetProps?.scheduleData?.schedules) {
      setScheduleData(
        lastMessage.widgetProps.scheduleData.schedules
      );
    }
  }, [setScheduleData]);
  if (!scheduleData || Object.keys(scheduleData).length === 0) {
    return <div>일정이 없습니다.</div>;
  }
  return (
    <div>
      <h3 className="font-bold text-xl mb-4">조회된 일정</h3>
      {Object.entries(scheduleData).map(([date, items]) => (
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
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CheckWidget;
