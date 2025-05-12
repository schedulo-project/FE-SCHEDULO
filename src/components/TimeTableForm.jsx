import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ECampusMode from "./timetable/ECampusMode";
import ManualMode from "./timetable/ManualMode";
import TimeTableGrid from "./TimeTableGrid";
import GetCookie from "../api/GetCookie";
import homeIcon from "../assets/timetableform/home_btn.svg";
const Logindata = await GetCookie();

const dayMap = {
  mon: "월",
  tue: "화",
  wed: "수",
  thu: "목",
  fri: "금",
  sat: "토",
  sun: "일",
};

const timeToFloat = (timeStr) => {
  const [hour, minute] = timeStr.split(":").map(Number);
  return hour + minute / 60;
};

// 병합 함수
const mergeScheduleData = (data) => {
  const groupedBySubjectAndDay = {};

  data.forEach((item) => {
    const key = `${item.subject}_${item.day_of_week}`;
    if (!groupedBySubjectAndDay[key]) {
      groupedBySubjectAndDay[key] = [];
    }
    groupedBySubjectAndDay[key].push(item);
  });

  const merged = [];

  Object.entries(groupedBySubjectAndDay).forEach(
    ([_, slots]) => {
      const sorted = slots.sort(
        (a, b) => parseInt(a.start_time) - parseInt(b.start_time)
      );

      let currentStart = sorted[0].start_time;
      let currentEnd = sorted[0].end_time;
      let currentLocation = sorted[0].location;
      let subject = sorted[0].subject;
      let day = sorted[0].day_of_week;

      for (let i = 1; i < sorted.length; i++) {
        const item = sorted[i];

        if (
          item.start_time === currentEnd &&
          item.location === currentLocation
        ) {
          currentEnd = item.end_time;
        } else {
          merged.push({
            name: subject,
            day: dayMap[day],
            startHour: timeToFloat(currentStart),
            endHour: timeToFloat(currentEnd),
            location: currentLocation,
            professor: "",
          });
          currentStart = item.start_time;
          currentEnd = item.end_time;
          currentLocation = item.location;
        }
      }

      merged.push({
        name: subject,
        day: dayMap[day],
        startHour: timeToFloat(currentStart),
        endHour: timeToFloat(currentEnd),
        location: currentLocation,
        professor: "",
      });
    }
  );

  return merged;
};

const TimeTableForm = () => {
  const [mode, setMode] = useState(null);
  const [schedule, setSchedule] = useState([]);
  const nav = useNavigate();

  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ0MTI3NDI1LCJpYXQiOjE3NDQxMDU4MjUsImp0aSI6IjM1N2U4ZjY3YWVjNDQ0MWJhMjhiNDk5ODk2NzkxY2FhIiwidXNlcl9pZCI6NH0.Og9x6IgnXlmc26jQLDdAFGxr9nBjXkdZhcYwo6FJSGQ";
  const token = Logindata.access;
  //임시 토큰 불러오기 코드

  useEffect(() => {
    const fetchInitialSchedule = async () => {
      try {
        const response = await axios.get(
          "http://13.124.140.60/schedules/timetables/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);

        const merged = mergeScheduleData(response.data);
        setSchedule(merged);
      } catch (error) {
        console.error(
          "기존 시간표를 불러오는 데 실패했습니다.",
          error
        );
      }
    };

    fetchInitialSchedule();
  }, []);

  const handleDataSubmit = (data) => {
    const nonDuplicated = data.filter((item) => {
      return !schedule.some(
        (s) =>
          s.name === item.name &&
          s.day === item.day &&
          s.startHour === item.startHour &&
          s.endHour === item.endHour
      );
    });
    setSchedule([...schedule, ...data]);
  };

  return (
    <div className="p-6">
      <button onClick={() => nav("/")}>
        <img src={homeIcon} alt="" />
      </button>
      <h1 className="text-3xl font-bold mb-6 text-center">
        시간표 등록
      </h1>
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
        <ECampusMode
          onSubmit={handleDataSubmit}
          setSchedule={setSchedule}
          schedule={schedule}
        />
      )}
      {mode === "manual" && (
        <ManualMode
          onSubmit={handleDataSubmit}
          setSchedule={setSchedule}
        />
      )}

      <h2 className="text-2xl font-semibold mt-8 mb-4 text-center">
        시간표
      </h2>
      <TimeTableGrid schedule={schedule} />
    </div>
  );
};

export default TimeTableForm;
