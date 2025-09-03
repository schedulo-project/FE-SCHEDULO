import { useEffect, useState } from "react";
import axios from "axios";
import { getTokenFromAuth } from "../utils/authApi";

const dayMap = {
  mon: "월",
  tue: "화",
  wed: "수",
  thu: "목",
  fri: "금",
  sat: "토",
  sun: "일",
  월: "월",
  화: "화",
  수: "수",
  목: "목",
  금: "금",
  토: "토",
  일: "일",
};

// 시간대를 소수점 단위로 변환 (예: "13:30" -> 13.5)
const timeToFloat = (timeStr) => {
  const [hour, minute] = timeStr.split(":").map(Number);
  return hour + minute / 60;
};

// 같은 요일에 연속된 교시를 병합하는 함수
const mergeContinuousSlots = (data) => {
  const groupedBySubjectAndDay = {};

  // 수업명과 요일로 그룹화
  data.forEach((item) => {
    const key = `${item.name}_${item.day}`;
    if (!groupedBySubjectAndDay[key]) {
      groupedBySubjectAndDay[key] = [];
    }
    groupedBySubjectAndDay[key].push(item);
  });

  const merged = [];

  Object.entries(groupedBySubjectAndDay).forEach(([_, slots]) => {
    // 시간대 기준으로 정렬
    const sorted = slots.sort((a, b) => a.startHour - b.startHour);

    let currentStart = sorted[0].startHour;
    let currentEnd = sorted[0].endHour;
    let currentLocation = sorted[0].location;
    let currentName = sorted[0].name;
    let currentDay = sorted[0].day;
    let currentProfessor = sorted[0].professor;

    for (let i = 1; i < sorted.length; i++) {
      const item = sorted[i];

      // 연속된 교시이고 강의실이 동일한 경우 병합
      if (item.startHour === currentEnd && item.location === currentLocation) {
        currentEnd = item.endHour;
      } else {
        merged.push({
          name: currentName,
          day: currentDay,
          startHour: currentStart,
          endHour: currentEnd,
          location: currentLocation,
          professor: currentProfessor,
        });
        currentStart = item.startHour;
        currentEnd = item.endHour;
        currentLocation = item.location;
        currentName = item.name;
        currentDay = item.day;
        currentProfessor = item.professor;
      }
    }

    // 마지막 항목 추가
    merged.push({
      name: currentName,
      day: currentDay,
      startHour: currentStart,
      endHour: currentEnd,
      location: currentLocation,
      professor: currentProfessor,
    });
  });

  return merged;
};

const ECampusMode = ({ onSubmit, setSchedule, schedule }) => {
  const [isFetched, setIsFetched] = useState(false);

  useEffect(() => {
    if (isFetched) return;

    const fetchTimetable = async () => {
      try {
        // const token =
        //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ0MTI3NDI1LCJpYXQiOjE3NDQxMDU4MjUsImp0aSI6IjM1N2U4ZjY3YWVjNDQ0MWJhMjhiNDk5ODk2NzkxY2FhIiwidXNlcl9pZCI6NH0.Og9x6IgnXlmc26jQLDdAFGxr9nBjXkdZhcYwo6FJSGQ";
        const token = getTokenFromAuth();
        console.log("token", token);
        //토큰 임시 불러오기 코드

        const response = await axios.get(
          "http://13.124.140.60/users/getTimeTable",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const rawData = response.data.courses_data;
        const transformedData = [];

        // ECampusMode에서 가져온 데이터를 변환
        rawData.forEach(([subject, schedules]) => {
          schedules.forEach(([day, timeRange, location]) => {
            const [startStr, endStr] = timeRange.split("~");
            const startHour = timeToFloat(startStr);
            const endHour = timeToFloat(endStr);

            const mappedDay =
              dayMap[day.toLowerCase()] ||
              (() => {
                console.warn("예상치 못한 요일 값:", day);
                return "일";
              })();

            transformedData.push({
              name: subject,
              day: mappedDay,
              startHour,
              endHour,
              professor: "",
              location,
            });
          });
        });

        // 중복 판단 및 덮어쓰기
        const updatedSchedule = [...schedule];

        transformedData.forEach((newItem) => {
          // 수업명, 요일, 시간대를 기준으로 중복 판단
          const index = updatedSchedule.findIndex(
            (s) =>
              s.name === newItem.name &&
              s.day === newItem.day &&
              s.startHour === newItem.startHour &&
              s.endHour === newItem.endHour
          );

          if (index !== -1) {
            // 동일한 수업이 존재하면 덮어쓰기
            updatedSchedule[index] = {
              ...updatedSchedule[index],
              location: newItem.location, // 강의실 정보 덮어쓰기
              professor: newItem.professor || updatedSchedule[index].professor,
            };
          } else {
            updatedSchedule.push(newItem);
          }
        });

        // 같은 요일에 연속된 교시 병합
        const mergedSchedule = mergeContinuousSlots(updatedSchedule);

        onSubmit(mergedSchedule);
        setSchedule(mergedSchedule);
        setIsFetched(true);
        console.table(mergedSchedule);
      } catch (error) {
        console.error("시간표 데이터를 불러오는 데 실패했습니다.", error);
      }
    };

    fetchTimetable();
  }, [schedule, onSubmit, setSchedule, isFetched]);

  return <></>;
};

export default ECampusMode;
