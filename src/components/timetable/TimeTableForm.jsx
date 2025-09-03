import { useState, useEffect } from "react";
import baseAxiosInstance from "../../api/baseAxiosApi";
import TimeTableModal from "./TimeTableModal";
import TimeTableGrid from "./TimeTableGrid";
import { useAuth } from "../../contexts/AuthContext";

const dayMap = {
  mon: "월",
  tue: "화",
  wed: "수",
  thu: "목",
  fri: "금",
  sat: "토",
  sun: "일",
};

// "HH:MM" 형식을 실수 시간으로 변환
const timeToFloat = (timeStr) => {
  const [hour, minute] = timeStr.split(":").map(Number);
  return hour + minute / 60;
};

// 시간표 데이터 병합 함수
const mergeScheduleData = (data) => {
  const groupedBySubjectAndDay = {};

  // 1) 과목명 + 요일별로 데이터 묶기
  data.forEach((item) => {
    const koreanDay = dayMap[item.day_of_week] || item.day_of_week;
    const key = `${item.subject}_${koreanDay}`;
    if (!groupedBySubjectAndDay[key]) {
      groupedBySubjectAndDay[key] = [];
    }
    groupedBySubjectAndDay[key].push({
      ...item,
      day_of_week: koreanDay, // 한국어로 통일
    });
  });

  const merged = [];

  // 2) 묶인 데이터별로 시간 정렬 후 병합
  Object.entries(groupedBySubjectAndDay).forEach(([_, slots]) => {
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

      if (item.start_time === currentEnd && item.location === currentLocation) {
        currentEnd = item.end_time;
      } else {
        merged.push({
          name: subject,
          day: day,
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
      day: day,
      startHour: timeToFloat(currentStart),
      endHour: timeToFloat(currentEnd),
      location: currentLocation,
      professor: "",
    });
  });

  return merged;
};

const TimeTableForm = () => {
  const { accessToken } = useAuth();
  const [schedule, setSchedule] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // schedule 변경 시 localStorage에 저장
  // useEffect(() => {
  //   localStorage.setItem("schedule", JSON.stringify(schedule));
  // }, [schedule]);

  // 초기 시간표 데이터 불러오기
  useEffect(() => {
    const fetchInitialSchedule = async () => {
      try {
        const response = await baseAxiosInstance.get("/schedules/timetables/");

        const merged = mergeScheduleData(response.data);
        setSchedule(merged);
      } catch (error) {
        console.error("기존 시간표를 불러오는 데 실패했습니다.", error);
      }
    };

    fetchInitialSchedule();
  }, []);

  // 새 데이터 제출 핸들러 (기존 schedule과 중복되지 않는 항목만 추가)
  const handleDataSubmit = (data) => {
    console.log("새로 추가할 데이터:", data);

    // 모달 입력값을 시간표 형식으로 변환
    const convertedData = data.map((item) => ({
      name: item.name,
      day: item.day,
      startHour: item.startHour,
      endHour: item.endHour,
      location: item.location || "",
      professor: item.professor || "",
    }));

    // 기존 schedule과 중복되지 않는 항목만 필터링
    const nonDuplicated = convertedData.filter((item) => {
      return !schedule.some(
        (s) =>
          s.name === item.name &&
          s.day === item.day &&
          s.startHour === item.startHour &&
          s.endHour === item.endHour
      );
    });

    const newSchedule = [...schedule, ...nonDuplicated];
    setSchedule(newSchedule);
    setIsModalOpen(false);
  };

  return (
    <div className="p-4">
      {/* 제목 */}
      <div className="mb-2 text-center">
        <h2 className="text-3xl font-bold">시간표 등록</h2>
      </div>

      {/* 직접 등록 버튼 */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-[120px] text-[#27374D] text-sm bg-[#DDE6ED] py-2 px-4 rounded-2xl"
        >
          직접 등록하기
        </button>
      </div>

      {/* 시간표 컴포넌트 */}
      <TimeTableGrid schedule={schedule} />

      {/* 직접 등록 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="h-full flex items-center justify-center lg:ml-[11.75rem]">
            <TimeTableModal
              onSubmit={handleDataSubmit}
              onClose={() => setIsModalOpen(false)}
              schedule={schedule}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTableForm;
