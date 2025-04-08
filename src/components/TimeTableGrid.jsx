import React from "react";

const days = ["월", "화", "수", "목", "금", "토", "일"];
const hours = Array.from({ length: 15 }, (_, i) => i + 8); // 9 ~ 22시
const colors = [
  "bg-red-100",
  "bg-yellow-100",
  "bg-green-100",
  "bg-blue-100",
  "bg-purple-100",
  "bg-pink-100",
  "bg-emerald-100",
  "bg-indigo-100",
];

// 중복 제거 함수: 같은 수업 이름/요일/시간대 기준, location 있는 쪽 우선
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
      subjectColorMap[subjectName] = colors[colorIndex % colors.length];
      colorIndex++;
    }
    return subjectColorMap[subjectName];
  };

  const refinedSchedule = deduplicateSchedule(schedule);

  return (
    <div className="flex justify-center mt-5">
      <table className="border-collapse border-spacing-0 w-full max-w-3xl table-fixed border border-gray-300">
        <thead>
          <tr className="">
            <th className="w-14 border border-gray-300"></th>
            {days.map((day) => (
              <th key={day} className="border border-gray-300 p-2 text-center">
                {day}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => (
            <tr key={hour}>
              <td className="border border-gray-300 p-2 text-center w-14">
                {hour > 12 ? hour - 12 : hour}
              </td>
              {days.map((day) => {
                const subject = refinedSchedule.find(
                  (s) => s.day === day && s.startHour === hour
                );
                const isOngoing = refinedSchedule.find(
                  (s) =>
                    s.day === day && hour >= s.startHour && hour < s.endHour
                );

                if (subject) {
                  const color = getColor(subject.name);

                  return (
                    <td
                      key={day}
                      className={`border border-gray-300 p-2 text-center align-middle ${color}`}
                      rowSpan={subject.endHour - subject.startHour}
                    >
                      <div className="flex flex-col items-center text-xs p-1 w-full h-full">
                        <div className="font-medium text-gray-800">
                          {subject.name}
                        </div>
                        {subject.professor && (
                          <div className="text-gray-600">
                            {subject.professor}
                          </div>
                        )}
                        <div className="text-gray-600 text-xs">
                          {subject.location}
                        </div>
                      </div>
                    </td>
                  );
                } else if (isOngoing) {
                  return null;
                } else {
                  return (
                    <td key={day} className="border border-gray-300 h-12"></td>
                  );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeTableGrid;
