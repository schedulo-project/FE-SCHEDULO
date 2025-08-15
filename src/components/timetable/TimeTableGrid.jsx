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
// - 같은 과목명(name), 요일(day), 시작/종료 시간대가 같으면 하나로 합침
// - 같은 수업일 경우 location(강의실 정보)이 있는 데이터를 우선 유지
const deduplicateSchedule = (schedule) => {
  const map = new Map();
  schedule.forEach((item) => {
    const key = `${item.name}-${item.day}-${item.startHour}-${item.endHour}`;
    const existing = map.get(key);
    if (!existing || (item.location && !existing.location)) {
      map.set(key, item);
    }
  });
  return Array.from(map.values());
};

const TimeTableGrid = ({ schedule }) => {
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
  console.log(refinedSchedule);

  // 시간표의 표시 시간 범위 계산
  const allStart = refinedSchedule.map((s) => s.startHour);
  const allEnd = refinedSchedule.map((s) => s.endHour);

  const minGridHour = Math.floor(Math.min(...allStart)); // 가장 이른 시작 시간
  const maxGridHour = Math.ceil(Math.max(...allEnd)); // 가장 늦은 종료 시간

  // 실제 표시할 시간 목록
  const hours = Array.from(
    { length: maxGridHour - minGridHour },
    (_, i) => i + minGridHour
  );

  const gridRowCount = hours.length; // 그리드 행 개수

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
        <div className="flex-1">
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
            {Array.from({ length: gridRowCount - 1 }).map(
              (_, i) =>
                days.map((_, j) => (
                  <div
                    key={`${i}-${j}`}
                    className="h-[64px] relative"
                  >
                    <div className="absolute left-0 right-0 border-t border-gray-200" />
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
                  className={`rounded-xl px-2 text-xs font-medium border ${color} flex flex-col justify-center items-center text-center`}
                  style={{
                    gridColumn: col,
                    gridRow: `${rowStart} / ${rowEnd}`,
                    height: "100%",
                    boxSizing: "border-box",
                    position: "relative",
                  }}
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
