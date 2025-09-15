import { useEffect, useState, useMemo, useCallback } from "react";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import baseAxiosInstance from "../../api/baseAxiosApi";
import TimeTableModal from "./TimeTableModal";
import TimeTableGrid from "./TimeTableGrid";
import { useAuth } from "../../contexts/AuthContext";

// 요일 매핑
const dayMap = {
  mon: "월",
  tue: "화",
  wed: "수",
  thu: "목",
  fri: "금",
  sat: "토",
  sun: "일",
};

// "HH:MM" → 소수 시간으로 변환
const timeToFloat = (timeStr) => {
  const [hour, minute] = timeStr.split(":").map(Number);
  return hour + minute / 60;
};

// 크롤링된 시간표 데이터 병합 함수
const normalizeCrawledSchedule = (coursesData) => {
  if (!coursesData) return [];
  const converted = [];

  coursesData.forEach(([courseName, timeSlots]) => {
    const groupedByDay = {};

    timeSlots.forEach(([day, timeRange, location]) => {
      if (!groupedByDay[day]) {
        groupedByDay[day] = [];
      }
      groupedByDay[day].push({
        timeRange,
        location,
      });
    });

    Object.entries(groupedByDay).forEach(([day, slots]) => {
      const sortedSlots = slots.sort((a, b) => {
        const timeA = a.timeRange.split("~")[0];
        const timeB = b.timeRange.split("~")[0];
        return timeToFloat(timeA) - timeToFloat(timeB);
      });

      let currentGroup = {
        startTime: null,
        endTime: null,
        location: null,
      };

      sortedSlots.forEach((slot, index) => {
        const [startTime, endTime] = slot.timeRange.split("~");

        if (currentGroup.startTime === null) {
          currentGroup.startTime = startTime;
          currentGroup.endTime = endTime;
          currentGroup.location = slot.location;
        } else if (
          currentGroup.endTime === startTime &&
          currentGroup.location === slot.location
        ) {
          currentGroup.endTime = endTime;
        } else {
          converted.push({
            name: courseName,
            day,
            startHour: timeToFloat(currentGroup.startTime),
            endHour: timeToFloat(currentGroup.endTime),
            location: currentGroup.location,
            professor: "",
          });

          currentGroup.startTime = startTime;
          currentGroup.endTime = endTime;
          currentGroup.location = slot.location;
        }

        if (index === sortedSlots.length - 1) {
          converted.push({
            name: courseName,
            day: day,
            startHour: timeToFloat(currentGroup.startTime),
            endHour: timeToFloat(currentGroup.endTime),
            location: currentGroup.location,
            professor: "",
          });
        }
      });
    });
  });

  return converted;
};

// 직접 등록한 시간표 데이터 병합 함수
const normalizeManualSchedule = (data) => {
  if (!data || !Array.isArray(data)) return [];
  const groupedBySubjectAndDay = {};

  data.forEach((item) => {
    const koreanDay =
      dayMap[item.day_of_week] || item.day_of_week;
    const key = `${item.subject}_${koreanDay}`;
    if (!groupedBySubjectAndDay[key]) {
      groupedBySubjectAndDay[key] = [];
    }
    groupedBySubjectAndDay[key].push({
      ...item,
      day_of_week: koreanDay,
    });
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
            day,
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
        day,
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
  const { accessToken } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const queryClient = useQueryClient();

  // 회원정보 조회
  const {
    data: userInfo = { email: "", student_id: "" },
    isLoading: userInfoLoading,
    error: userInfoError,
  } = useQuery({
    queryKey: ["userInfo"],
    queryFn: async () => {
      const response = await baseAxiosInstance.get("/users/", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      return response.data;
    },
    enabled: !!accessToken,
  });

  // DB 시간표 조회
  const {
    data: manualData = [],
    isLoading: manualLoading,
    error: manualError,
  } = useQuery({
    queryKey: ["manualTimetable"],
    queryFn: async () => {
      const response = await baseAxiosInstance.get(
        "/schedules/timetables/",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return response.data;
    },
    enabled: !!accessToken,
  });

  // DB에 데이터 없을 때만 크롤링 시간표 요청
  const {
    data: crawledData,
    isLoading: crawledLoading,
    error: crawledError,
  } = useQuery({
    queryKey: ["crawledTimetable"],
    queryFn: async () => {
      const response = await baseAxiosInstance.get(
        "/users/getTimeTable/",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      return response.data;
    },
    enabled: !!accessToken && manualData.length === 0,
  });

  // 시간표 저장 mutation
  const saveTimeTableMutation = useMutation({
    mutationFn: async (data) => {
      const payload = data.map((item) => ({
        subject: item.name,
        day_of_week:
          Object.keys(dayMap).find(
            (key) => dayMap[key] === item.day
          ) || item.day,
        start_time: `${String(
          Math.floor(item.startHour)
        ).padStart(2, "0")}:00:00`,
        end_time: `${String(Math.floor(item.endHour)).padStart(
          2,
          "0"
        )}:00:00`,
        location: item.location || "",
      }));

      // 병렬로 모든 시간표 저장
      return Promise.all(
        payload.map((timetable) =>
          baseAxiosInstance.post(
            "/schedules/timetables/",
            timetable,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          )
        )
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["manualTimetable"]);
      setIsModalOpen(false);
    },
    onError: (error) => {
      console.error("시간표 저장 실패:", error);
    },
  });

  // DB 없을 때 크롤링 데이터 자동 저장
  useEffect(() => {
    if (manualData.length === 0 && crawledData?.courses_data) {
      const normalized = normalizeCrawledSchedule(
        crawledData.courses_data
      );
      if (normalized.length > 0) {
        saveTimeTableMutation.mutate(normalized);
      }
    }
  }, [manualData, crawledData, saveTimeTableMutation]);

  // 최종 시간표 (DB 기준)
  const schedule = useMemo(() => {
    return normalizeManualSchedule(manualData);
  }, [manualData]);

  const handleDataSubmit = useCallback(
    (data) => {
      saveTimeTableMutation.mutate(data);
    },
    [saveTimeTableMutation]
  );

  // 모달 열기/닫기 핸들러
  const handleModalOpen = useCallback(() => {
    setIsModalOpen(true);
  }, []);
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  // 로딩 상태
  const isLoading =
    userInfoLoading || crawledLoading || manualLoading;

  // 에러 상태
  if (userInfoError || crawledError || manualError) {
    return (
      <div className="p-4 text-center">
        <p className="text-red-500">
          데이터를 불러오는 중 오류가 발생했습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* 제목 */}
      <div className="mb-2 text-center">
        <h2 className="text-3xl font-bold">시간표 등록</h2>
      </div>

      {/* 직접 등록 버튼 */}
      <div
        className={`flex mb-6 ${
          isLoading ? "justify-center" : "justify-end"
        }`}
      >
        <button
          onClick={handleModalOpen}
          disabled={isLoading || saveTimeTableMutation.isLoading}
          className="w-[120px] text-[#27374D] text-sm bg-[#DDE6ED] py-2 px-4 rounded-2xl disabled:opacity-50"
        >
          {saveTimeTableMutation.isLoading
            ? "저장 중..."
            : "직접 등록하기"}
        </button>
      </div>

      {/* 로딩 상태 표시 */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">
            시간표를 불러오는 중...
          </div>
        </div>
      )}

      {/* 시간표 컴포넌트 */}
      {!isLoading && <TimeTableGrid schedule={schedule} />}

      {/* 직접 등록 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="h-full flex items-center justify-center lg:ml-[11.75rem]">
            <TimeTableModal
              onSubmit={handleDataSubmit}
              onClose={handleModalClose}
              schedule={schedule}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTableForm;
