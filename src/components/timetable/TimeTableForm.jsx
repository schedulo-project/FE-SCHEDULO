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
    slots.sort((a, b) => {
      const aNum = parseInt(a.start_time, 10);
      const bNum = parseInt(b.start_time, 10);
      return aNum - bNum;
    });

    let firstItem = slots[0];
    let currentStart = firstItem.start_time;
    let currentEnd = firstItem.end_time;
    let currentLocation = firstItem.location || "";
    let subject = firstItem.subject;
    let day = firstItem.day_of_week;
    let currentOriginals = [firstItem];

    for (let i = 1; i < slots.length; i++) {
      const item = slots[i];

      const prevEndFloat = timeToFloat(currentEnd);
      const itemStartFloat = timeToFloat(item.start_time);
      const itemEndFloat = timeToFloat(item.end_time);

      if (
        (Math.abs(prevEndFloat - itemStartFloat) < 1e-6 &&
          item.location === currentLocation) ||
        prevEndFloat >= itemStartFloat
      ) {
        currentEnd =
          itemEndFloat === Math.floor(itemEndFloat)
            ? `${String(Math.floor(itemEndFloat)).padStart(
                2,
                "0"
              )}:00:00`
            : item.end_time;

        currentOriginals.push(item);
      } else {
        merged.push({
          originalData: [...currentOriginals],
          name: subject,
          day,
          startHour: timeToFloat(currentStart),
          endHour: timeToFloat(currentEnd),
          location: currentLocation,
          professor: currentOriginals[0]?.professor || "",
        });

        firstItem = item;
        currentStart = item.start_time;
        currentEnd = item.end_time;
        currentLocation = item.location || "";
        subject = item.subject;
        day = item.day_of_week;
        currentOriginals = [item];
      }
    }

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
  const [crawlingStatus, setCrawlingStatus] = useState("");
  const [isPolling, setIsPolling] = useState(false);
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

  // 크롤링된 시간표 불러오기
  const handleFetchCrawled = useCallback(async () => {
    if (schedule.length > 0) {
      const confirmMessage = `시간표를 초기화하고 새로 불러올까요?`;

      if (!confirm(confirmMessage)) {
        return;
      }
    }

    try {
      setCrawlingStatus("크롤링 요청 중...");
      setIsPolling(true);

      const response = await baseAxiosInstance.get(
        "/users/getTimeTable/",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      console.log("크롤링 API 응답:", response.data);

      if (
        response.data?.courses_data &&
        Array.isArray(response.data.courses_data)
      ) {
        setCrawlingStatus("시간표 데이터 처리 중...");

        const normalized = normalizeCrawledSchedule(
          response.data.courses_data
        );

        if (normalized.length > 0) {
          await saveTimeTableMutation.mutateAsync(normalized);
          setCrawlingStatus("");
          setIsPolling(false);
          alert("시간표가 성공적으로 불러와졌습니다!");
        } else {
          setCrawlingStatus("");
          setIsPolling(false);
          alert("불러올 시간표 데이터가 없습니다.");
        }
        return;
      }

      // 비동기 처리 (task_id 기반)
      if (
        response.data?.status === "STARTED" &&
        response.data?.task_id
      ) {
        const taskId = response.data.task_id;
        setCrawlingStatus("시간표 크롤링 중...");

        // 상태 확인 폴링 설정
        let attempts = 0;
        const maxAttempts = 30;

        const pollStatus = async () => {
          try {
            attempts++;

            if (attempts > maxAttempts) {
              throw new Error(
                "시간 초과: 크롤링이 너무 오래 걸립니다."
              );
            }

            const statusRes = await baseAxiosInstance.get(
              `/users/timetable/status/`,
              {
                params: { task_id: taskId },
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                },
              }
            );

            const progress = statusRes.data.progress || 0;
            const statusMessage =
              statusRes.data.status || "크롤링 진행 중...";
            setCrawlingStatus(
              `${statusMessage} (${progress}% - ${attempts}/${maxAttempts})`
            );

            const currentState = statusRes.data.state;

            if (currentState === "SUCCESS") {
              setCrawlingStatus("시간표 데이터 처리 중...");

              let coursesData = null;

              if (statusRes.data.courses_data) {
                coursesData = statusRes.data.courses_data;
              } else if (
                statusRes.data.result &&
                statusRes.data.result.courses_data
              ) {
                coursesData = statusRes.data.result.courses_data;
              } else if (
                statusRes.data.result &&
                Array.isArray(statusRes.data.result)
              ) {
                coursesData = statusRes.data.result;
              }

              if (coursesData) {
                const normalized =
                  normalizeCrawledSchedule(coursesData);

                if (normalized.length > 0) {
                  await saveTimeTableMutation.mutateAsync(
                    normalized
                  );
                  setCrawlingStatus("");
                  setIsPolling(false);
                  alert("시간표가 성공적으로 불러와졌습니다!");
                } else {
                  setCrawlingStatus("");
                  setIsPolling(false);
                  alert("불러올 시간표 데이터가 없습니다.");
                }
              } else {
                setCrawlingStatus("");
                setIsPolling(false);

                await queryClient.invalidateQueries([
                  "manualTimetable",
                ]);

                alert(
                  "크롤링이 완료되었습니다. 시간표를 새로고침했습니다."
                );
              }
              return;
            }

            if (
              currentState === "FAILURE" ||
              currentState === "REVOKED"
            ) {
              throw new Error(
                statusRes.data.status || "크롤링에 실패했습니다."
              );
            }

            // 아직 진행 중이면 2초 후 다시 확인 (PROGRESS, PENDING, STARTED 등)
            if (
              currentState === "PROGRESS" ||
              currentState === "PENDING" ||
              currentState === "STARTED"
            ) {
              setTimeout(pollStatus, 2000);
            } else {
              console.warn("예상하지 못한 상태:", currentState);
              setTimeout(pollStatus, 2000);
            }
          } catch (err) {
            console.error("상태 확인 오류:", err);
            setCrawlingStatus("");
            setIsPolling(false);
            alert(
              `${
                err.message ||
                "상태 확인 중 오류가 발생했습니다."
              }`
            );
          }
        };

        setTimeout(pollStatus, 2000);
      } else {
        setCrawlingStatus("");
        setIsPolling(false);
        alert("예상하지 못한 응답 형식입니다.");
      }
    } catch (err) {
      console.error("시간표 크롤링 실패:", err);
      setCrawlingStatus("");
      setIsPolling(false);

      if (err.response?.status === 401) {
        alert("인증이 필요합니다. 다시 로그인해주세요.");
      } else if (err.response?.status === 404) {
        alert("시간표 서비스를 찾을 수 없습니다.");
      } else if (err.response?.status >= 500) {
        alert("서버 오류입니다. 잠시 후 다시 시도해주세요.");
      } else {
        alert(
          `시간표 불러오기에 실패했습니다: ${
            err.message || "알 수 없는 오류"
          }`
        );
      }
    }
  }, [accessToken, saveTimeTableMutation]);

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

  // 최종 시간표 (DB 기준)
  const schedule = useMemo(() => {
    return normalizeManualSchedule(manualData);
  }, [manualData]);

  const handleDataSubmit = useCallback(
    (data) => {
      if (editingSubject) {
        updateTimeTableMutation.mutate({
          originalData: editingSubject.originalData,
          updatedSubject: data[0],
        });
      } else {
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

  const handleModalOpen = useCallback(() => {
    setEditingSubject(null);
    setIsModalOpen(true);
  }, []);
  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setEditingSubject(null);
  }, []);

  const handleSubjectClick = useCallback((subject) => {
    setEditingSubject(subject);
    setIsModalOpen(true);
  }, []);

  const isLoading = userInfoLoading || manualLoading;

  if (userInfoError || manualError) {
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

      {/* 버튼들 */}
      <div
        className={`flex gap-2 mb-6 ${
          isLoading ? "justify-center" : "justify-end"
        }`}
      >
        <button
          onClick={handleFetchCrawled}
          disabled={isLoading || isPolling}
          className="w-[120px flex items-center justify-center text-[#27374D] text-sm bg-[#DDE6ED] py-2 px-4 rounded-2xl disabled:opacity-50 whitespace-nowrap"
        >
          {isPolling ? "불러오는 중..." : "시간표 불러오기"}
        </button>

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

      {/* 로딩 상태 */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          <div className="text-gray-500">
            시간표를 불러오는 중...
          </div>
        </div>
      )}

      {/* 시간표 */}
      {!isLoading && (
        <TimeTableGrid
          schedule={schedule}
          onSubjectClick={handleSubjectClick}
        />
      )}

      {/* 모달 */}
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
