import React from "react";

const days = ["일", "월", "화", "수", "목", "금", "토"];
const hours = Array.from({ length: 15 }, (_, i) => i + 8);
const colors = [
  "bg-[#E6FEFF] border-[#24B0C9] text-[#24B0C9]",
  "bg-[#FFBABE] border-[#FF3C6A] text-[#FF3C6A]",
  "bg-[#FFDDBA] border-[#FF7A3C] text-[#FF7A3C]",
  "bg-[#FFE7BA] border-[#D78D03] text-[#D78D03]",
  "bg-[#E9EFFF] border-[#5272E9] text-[#5272E9]",
];

// 스케줄 중복 제거 함수
const deduplicateSchedule = (schedule) => {
  const grouped = {};

  schedule.forEach((item) => {
    const key = `${item.name}-${item.day}`;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  });

  const merged = [];

  Object.values(grouped).forEach((items) => {
    // 시작 시간 기준 정렬
    items.sort((a, b) => a.startHour - b.startHour);

    let current = items[0];

    for (let i = 1; i < items.length; i++) {
      const next = items[i];

      // 같은 요일 + 같은 과목 + 시간이 이어지거나 겹치면 병합
      if (current.endHour >= next.startHour) {
        current.endHour = Math.max(
          current.endHour,
          next.endHour
        );

        if (!current.location && next.location) {
          current.location = next.location;
        }

        if (!current.professor && next.professor) {
          current.professor = next.professor;
        }
      } else {
        merged.push(current);
        current = next;
      }
    }

    merged.push(current);
  });

  return merged;
};

const TimeTableGrid = ({ schedule, onSubjectClick }) => {
  const subjectColorMap = {};
  let colorIndex = 0;

  const getColor = (subjectName) => {
    if (!subjectColorMap[subjectName]) {
      subjectColorMap[subjectName] =
        colors[colorIndex % colors.length];
      colorIndex++;
    }
    return subjectColorMap[subjectName];
  };

  // 중복 제거된 스케줄 데이터
  const refinedSchedule = deduplicateSchedule(schedule);

  // 시간표의 표시 시간 범위 계산
  const allStart = refinedSchedule.map((s) => s.startHour);
  const allEnd = refinedSchedule.map((s) => s.endHour);

  const defaultStartHour = 8;
  const defaultEndHour = 22;

  const minGridHour =
    allStart.length > 0
      ? Math.floor(Math.min(...allStart))
      : defaultStartHour;
  const maxGridHour =
    allEnd.length > 0
      ? Math.ceil(Math.max(...allEnd))
      : defaultEndHour;

  // 실제 표시할 시간 목록
  const hours = Array.from(
    { length: maxGridHour - minGridHour + 1 },
    (_, i) => i + minGridHour
  );

  const gridRowCount = hours.length - 1; // 그리드 행 개수

  const handleSubjectClick = (subject) => {
    if (onSubjectClick) {
      onSubjectClick(subject);
    }
  };

  return (
    <div className="w-full overflow-x-auto font-[Montserrat]">
      <div className="flex">
        {/* 시간 컬럼 (왼쪽 고정) */}
        <div className="w-[70px] flex-shrink-0">
          <div className="h-10"></div>
          {hours.map((hour) => (
            <div
              key={hour}
              className="h-[64px] flex items-start justify-start pl-2"
            >
              <div className="text-gray-400">
                {String(hour).padStart(2, "0")}:00
              </div>
            </div>
          ))}
        </div>

        {/* 시간표 메인 그리드 */}
        <div className="flex-1 min-w-[600px]">
          {/* 요일 헤더 */}
          <div className="grid grid-cols-7 text-center text-gray-400">
            {days.map((day) => (
              <div
                key={day}
                className="h-10 flex items-center justify-center"
              >
                {day}
              </div>
            ))}
          </div>

          {/* 시간표 본문 */}
          <div
            className="grid grid-cols-7 relative"
            style={{
              gridTemplateRows: `repeat(${gridRowCount}, 64px)`,
            }}
          >
            {/* 빈 셀 + 가로선 */}
            {Array.from({ length: gridRowCount }).map((_, i) =>
              days.map((_, j) => (
                <div
                  key={`${i}-${j}`}
                  className="h-[64px] relative"
                >
                  {i < gridRowCount - 1 && (
                    <div className="absolute left-0 right-0 border-t border-gray-200" />
                  )}
                </div>
              ))
            )}

            {/* 수업 카드 렌더링 */}
            {refinedSchedule.map((item) => {
              const col = days.indexOf(item.day) + 1;
              const rowStart =
                Math.round(item.startHour - minGridHour) + 1;
              const rowEnd =
                Math.round(item.endHour - minGridHour) + 1;
              const color = getColor(item.name);

              return (
                <div
                  key={`${item.name}-${item.day}-${item.startHour}`}
                  className={`rounded-xl px-2 text-xs font-medium border ${color} flex flex-col justify-center items-center text-center cursor-pointer`}
                  style={{
                    gridColumn: col,
                    gridRow: `${rowStart} / ${rowEnd}`,
                    height: "100%",
                    boxSizing: "border-box",
                    position: "relative",
                  }}
                  onClick={() => handleSubjectClick(item)}
                >
                  <div>{item.name}</div>
                  {item.professor && <div>{item.professor}</div>}
                  {item.location && <div>{item.location}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeTableGrid;
