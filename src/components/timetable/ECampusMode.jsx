import { useEffect } from "react";
import axios from "axios";

const dayMap = {
  mon: "월",
  tue: "화",
  wed: "수",
  thu: "목",
  fri: "금",
  sat: "토",
  sun: "일",
};

const ECampusMode = ({ onSubmit, setSchedule }) => {
  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const token =
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQzOTc3NTg0LCJpYXQiOjE3NDM5NTU5ODQsImp0aSI6IjViYjI1ZDJmYjA5ZjRjMmNiOGM4ZWQ1YTZmNzMwZDY0IiwidXNlcl9pZCI6NH0.3o0u-fVmI3bDtdr6KX-XoOo03EOOsEQHs4CLw9yavsw";

        const response = await axios.get(
          "http://13.124.140.60/schedules/timetables/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const rawData = response.data;
        console.log("원본 시간표 데이터:", rawData);

        const transformedData = rawData.map((item) => {
          const startHour = parseInt(item.start_time.split(":")[0]);
          const endHour = parseInt(item.end_time.split(":")[0]);

          return {
            name: item.subject,
            day: dayMap[item.day_of_week],
            startHour,
            endHour,
            professor: "",
            location: "",
          };
        });

        onSubmit(transformedData);
        console.log("변환된 시간표 데이터:", transformedData);
      } catch (error) {
        console.error("시간표 데이터를 불러오는 데 실패했습니다.", error);
      }
    };

    fetchTimetable();
  }, []);

  return <></>;
};

export default ECampusMode;
