import {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
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

  Object.values(groupedBySubjectAndDay).forEach((slots) => {
    // 시작 시간 기준 정렬 — start_time이 "09:00:00" 같은 문자열이라면 parseInt로도 시간 비교는 가능
    slots.sort((a, b) => {
      const aNum = parseInt(a.start_time, 10);
      const bNum = parseInt(b.start_time, 10);
      return aNum - bNum;
    });

    // 첫 항목을 기준으로 병합 시작
    let firstItem = slots[0];
    let currentStart = firstItem.start_time;
    let currentEnd = firstItem.end_time;
    let currentLocation = firstItem.location || "";
    let subject = firstItem.subject;
    let day = firstItem.day_of_week;
    // originalData 배열을 계속 누적해서 보관할 것
    let currentOriginals = [firstItem];

    for (let i = 1; i < slots.length; i++) {
      const item = slots[i];

      // 이어지는 시간(예: 이전 end_time === 다음 start_time) 혹은 겹침(겹치면 end를 max로)
      const prevEndFloat = timeToFloat(currentEnd);
      const itemStartFloat = timeToFloat(item.start_time);
      const itemEndFloat = timeToFloat(item.end_time);

      // 이어지거나 겹치는 경우 (동일 장소인 경우에만 병합하거나, 겹침이면 병합)
      if (
        (Math.abs(prevEndFloat - itemStartFloat) < 1e-6 &&
          item.location === currentLocation) ||
        prevEndFloat >= itemStartFloat
      ) {
        // 병합: end 시간 업데이트 (겹치면 max)
        currentEnd = String(
          `${Math.max(prevEndFloat, itemEndFloat)
            .toString()
            .padStart(2, "0")}`
        );
        // currentEnd을 원래 포맷으로 유지하기 위해 item.end_time 사용
        currentEnd =
          itemEndFloat === Math.floor(itemEndFloat)
            ? `${String(Math.floor(itemEndFloat)).padStart(
                2,
                "0"
              )}:00:00`
            : item.end_time;

        currentOriginals.push(item);
      } else {
        // 현재 그룹을 merged에 푸시
        merged.push({
          originalData: [...currentOriginals],
          name: subject,
          day,
          startHour: timeToFloat(currentStart),
          endHour: timeToFloat(currentEnd),
          location: currentLocation,
          professor: currentOriginals[0]?.professor || "",
        });

        // 새로운 그룹 시작
        firstItem = item;
        currentStart = item.start_time;
        currentEnd = item.end_time;
        currentLocation = item.location || "";
        subject = item.subject;
        day = item.day_of_week;
        currentOriginals = [item];
      }
    }

    // 마지막 그룹 푸시
    merged.push({
      id: currentOriginals[0]?.id ?? null,
      originalData: [...currentOriginals],
      name: subject,
      day,
      startHour: timeToFloat(currentStart),
      endHour: timeToFloat(currentEnd),
      location: currentLocation,
      professor: currentOriginals[0]?.professor || "",
    });
  });

  return merged;
};

const TimeTableForm = () => {
  const { accessToken } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
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

  // 시간표 저장
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

  // 시간표 수정
  const updateTimeTableMutation = useMutation({
    mutationFn: async ({ originalData, updatedSubject }) => {
      if (originalData && originalData.length > 0) {
        const firstItem = originalData[0];

        const updateData = new FormData();
        updateData.append("subject", updatedSubject.name);
        updateData.append(
          "day_of_week",
          Object.keys(dayMap).find(
            (key) => dayMap[key] === updatedSubject.day
          ) || updatedSubject.day
        );
        updateData.append(
          "start_time",
          `${String(
            Math.floor(updatedSubject.startHour)
          ).padStart(2, "0")}:00`
        );
        updateData.append(
          "end_time",
          `${String(Math.floor(updatedSubject.endHour)).padStart(
            2,
            "0"
          )}:00`
        );

        if (updatedSubject.location) {
          updateData.append("location", updatedSubject.location);
        }
        if (updatedSubject.professor) {
          updateData.append(
            "professor",
            updatedSubject.professor
          );
        }

        const updatePromise = baseAxiosInstance.put(
          `/schedules/timetables/${firstItem.id}/`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const deletePromises = originalData
          .slice(1)
          .map((item) =>
            baseAxiosInstance.delete(
              `/schedules/timetables/${item.id}/`,
              {
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            )
          );

        return Promise.all([updatePromise, ...deletePromises]);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["manualTimetable"]);
      setIsModalOpen(false);
      setEditingSubject(null);
    },
    onError: (error) => {
      console.error("시간표 수정 실패:", error);
    },
  });

  // 시간표 삭제
  const deleteTimeTableMutation = useMutation({
    mutationFn: async (originalData) => {
      if (!originalData || originalData.length === 0) {
        throw new Error("삭제할 데이터가 없습니다.");
      }

      return Promise.all(
        originalData.map((item) =>
          baseAxiosInstance.delete(
            `/schedules/timetables/${item.id}/`,
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
      setEditingSubject(null);
    },
    onError: (error) => {
      console.error("시간표 삭제 실패:", error);
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
      if (editingSubject) {
        // 수정 모드
        updateTimeTableMutation.mutate({
          originalData: editingSubject.originalData,
          updatedSubject: data[0],
        });
      } else {
        // 추가 모드
        saveTimeTableMutation.mutate(data);
      }
    },
    [
      editingSubject,
      saveTimeTableMutation,
      updateTimeTableMutation,
    ]
  );

  const handleDelete = useCallback(() => {
    if (editingSubject && editingSubject.originalData) {
      if (
        confirm(
          `${editingSubject.name} 강의를 삭제하시겠습니까?`
        )
      ) {
        deleteTimeTableMutation.mutate(
          editingSubject.originalData
        );
      }
    }
  }, [editingSubject, deleteTimeTableMutation]);

  // 모달 열기/닫기 핸들러
  const handleModalOpen = useCallback(() => {
    setEditingSubject(null);
    setIsModalOpen(true);
  }, []);
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setEditingSubject(null);
  }, []);

  // 시간표 클릭 핸들러
  const handleSubjectClick = useCallback((subject) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
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
          className="w-[120px] text-[#27374D] text-sm bg-[#DDE6ED] py-2 px-4 rounded-2xl disabled:opacity-50 whitespace-nowrap"
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
      {!isLoading && (
        <TimeTableGrid
          schedule={schedule}
          onSubjectClick={handleSubjectClick}
        />
      )}

      {/* 직접 등록/수정 모달 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="h-full flex items-center justify-center lg:ml-[11.75rem]">
            <TimeTableModal
              onSubmit={handleDataSubmit}
              onClose={handleModalClose}
              onDelete={editingSubject ? handleDelete : null}
              schedule={schedule}
              editingSubject={editingSubject}
              isLoading={
                saveTimeTableMutation.isLoading ||
                updateTimeTableMutation.isLoading ||
                deleteTimeTableMutation.isLoading
              }
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeTableForm;
