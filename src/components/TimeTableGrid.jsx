import React from "react";

const days = ["월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
const hours = Array.from({ length: 14 }, (_, i) => i + 9); // 9 ~ 22시
const colors = [
  "bg-red-200", "bg-green-200", "bg-yellow-200", "bg-orange-200", "bg-blue-200"
];

const TimeTableGrid = ({ schedule }) => {
  return (
    <div className="flex justify-center mt-5">
      <table className="border-collapse border-spacing-0 w-11/12 max-w-lg table-fixed border border-gray-300">
        <thead>
          <tr className="">
            <th className="w-14 border border-gray-300"></th>
            {days.map((day) => ( // 요일
              <th key={day} className="border border-gray-300 p-2 text-center">{day}</th>
            ))} 
          </tr>
        </thead>
        <tbody>
          {hours.map((hour) => ( // 시간 별 행
            <tr key={hour}>
              <td className="border border-gray-300 p-2 text-center w-14">{hour}:00</td>
              {days.map((day) => {
                const subject = schedule.find((s) => s.day === day && s.startHour === hour);
                const ongoingSubject = schedule.find(
                  (s) => s.day === day && s.startHour < hour && s.endHour > hour
                );

                if (subject) {
                  const subjectIndex = schedule.findIndex(
                    (s) => s.name === subject.name && s.startHour === subject.startHour && s.day === subject.day
                  );
                  const color = colors[subjectIndex % colors.length];

                  return (
                    <td
                      key={day}
                      className={`border border-gray-300 p-2 text-center align-middle ${color}`}
                      rowSpan={subject.endHour - subject.startHour}
                    >
                      <div className="flex flex-col items-center text-xs p-1 w-full h-full">
                        <div className="font-bold">{subject.name}</div>
                        <div>{subject.professor}</div>
                        <div>{subject.location}</div>
                      </div>
                    </td>
                  );
                } else if (ongoingSubject) {
                  return null;
                } else {
                  return <td key={day} className="border border-gray-300 h-12"></td>;
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
