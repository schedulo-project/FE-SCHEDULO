import { useState } from "react";
import ECampusMode from "./timetable/ECampusMode";
import ManualMode from "./timetable/ManualMode";
import TimeTableGrid from "./TimeTableGrid";

const TimeTableForm = () => {
  const [mode, setMode] = useState(null);
  const [schedule, setSchedule] = useState([]);

  console.log(schedule);

  const handleDataSubmit = (data) => {
    setSchedule([...schedule, ...data]);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">시간표 등록</h1>
      {!mode && (
        <div className="flex justify-center space-x-4 mb-6">
          <button
            onClick={() => setMode("ecampus")}
            className="border py-2 px-4 rounded"
          >
            시간표 불러오기
          </button>
          <button
            onClick={() => setMode("manual")}
            className="border  py-2 px-4 rounded"
          >
            직접 등록
          </button>
        </div>
      )}
      {mode === "ecampus" && (
        <ECampusMode onSubmit={handleDataSubmit} setSchedule={setSchedule} />
      )}
      {mode === "manual" && (
        <ManualMode onSubmit={handleDataSubmit} setSchedule={setSchedule} />
      )}

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-center">시간표</h2>
      <TimeTableGrid schedule={schedule} />
    </div>
  );
};

export default TimeTableForm;
