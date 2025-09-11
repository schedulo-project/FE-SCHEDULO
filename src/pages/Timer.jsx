import { useEffect, useRef } from "react";
import { Play, Pause, Coffee, Briefcase } from "lucide-react";
import { Button } from "../components/PomodoroTimer/Button";
import SettingsModal from "../components/PomodoroTimer/SettingsModal";
import { useAtom } from "jotai";
import {
  workTimeAtom,
  breakTimeAtom,
  totalCyclesAtom,
  timeLeftAtom,
  isActiveAtom,
  isWorkAtom,
  cyclesAtom,
  isCompletedAtom,
  appStateAtom,
  lastUpdatedAtom,
} from "../atoms/TimerAtoms";

export default function Timer() {
  // Jotai atoms으로 상태 관리
  const [appState, setAppState] = useAtom(appStateAtom);

  // 설정 상태
  const [workTime, setWorkTime] = useAtom(workTimeAtom);
  const [breakTime, setBreakTime] = useAtom(breakTimeAtom);
  const [totalCycles, setTotalCycles] = useAtom(totalCyclesAtom);

  const [timeLeft, setTimeLeft] = useAtom(timeLeftAtom);
  const [isActive, setIsActive] = useAtom(isActiveAtom);
  const [isWork, setIsWork] = useAtom(isWorkAtom);
  const [cycles, setCycles] = useAtom(cyclesAtom);
  const [isCompleted, setIsCompleted] = useAtom(isCompletedAtom);
  const [lastUpdated, setLastUpdated] = useAtom(lastUpdatedAtom);

  const intervalRef = useRef(null);

  // 타이머 재개 시 시간 보정을 위한 효과
  useEffect(() => {
    // 페이지 방문시 마지막 업데이트 이후의 시간 차이 계산
    if (isActive && !intervalRef.current) {
      const now = Date.now();
      const elapsed = Math.floor((now - lastUpdated) / 1000);

      // 경과 시간이 있고 타이머가 아직 완료되지 않았다면 시간 조정
      if (elapsed > 0 && timeLeft > 0) {
        const newTimeLeft = Math.max(0, timeLeft - elapsed);
        setTimeLeft(newTimeLeft);

        // 타이머가 완료된 경우
        if (newTimeLeft === 0) {
          handleTimerComplete();
        }
      }

      // 타이머 다시 시작
      startTimer();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  // 타이머 완료 처리 함수
  const handleTimerComplete = () => {
    if (isWork) {
      const newCycles = cycles + 1;
      setCycles(newCycles);

      if (newCycles >= totalCycles) {
        // 모든 사이클 완료
        setIsCompleted(true);
        setIsActive(false);
      } else {
        // 휴식시간으로 전환
        setIsWork(false);
        setTimeLeft(breakTime * 60);
      }
    } else {
      // 작업시간으로 전환
      setIsWork(true);
      setTimeLeft(workTime * 60);
    }
  };

  // 타이머 실행
  const startTimer = () => {
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((time) => {
        const newTime = time - 1;
        setLastUpdated(Date.now());

        if (newTime <= 0) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          handleTimerComplete();
          return 0;
        }

        return newTime;
      });
    }, 1000);
  };

  // isActive 상태 감시
  useEffect(() => {
    if (isActive) {
      startTimer();
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isActive]);

  // 타이머 토글(시작/정지)
  const toggleTimer = () => {
    const newIsActive = !isActive;
    setIsActive(newIsActive);

    // 타이머 상태 업데이트
    setLastUpdated(Date.now());

    if (newIsActive) {
      startTimer();
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // 타이머 취소
  const cancelTimer = () => {
    setIsActive(false);
    setIsWork(true);
    setCycles(0);
    setIsCompleted(false);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setAppState("setup"); // 설정 화면으로 돌아가기
  };

  // 시간 포맷팅 (mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // 진행률 계산
  const getProgress = () => {
    const totalTime = isWork ? workTime * 60 : breakTime * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  // 설정 모달로 전환
  const openSettings = () => {
    setAppState("setup"); // 설정 모달로 전환
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {appState === "setup" ? (
        <SettingsModal
          onClose={() => {}} // 초기 화면에서는 닫기 불가
          isInitial={true}
        />
      ) : isCompleted ? (
        // 완료 화면
        <div className="w-full max-w-md mx-auto shadow-2xl bg-white rounded-lg">
          <div className="p-8">
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">🎉</div>
              <div className="text-2xl font-bold text-purple-600 mb-4">
                모든 세션 완료!
              </div>
              <div className="text-gray-600 mb-8">
                모든 세션이 완료되었습니다! 수고하셨습니다.
              </div>

              {/* 완료 통계 */}
              <div className="text-sm text-gray-500 mb-4">
                총 작업 시간:{" "}
                <span className="font-semibold text-gray-800">
                  {workTime * cycles}분
                </span>
              </div>

              <Button
                onClick={() => setAppState("setup")}
                size="lg"
                className="px-8 text-white"
                style={{
                  backgroundColor: "#26374D",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "#1e2c3d")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor =
                    "#26374D")
                }
              >
                새로운 세션 시작하기
              </Button>
            </div>
          </div>
        </div>
      ) : (
        // 타이머 UI
        <div className="w-full max-w-md mx-auto shadow-2xl bg-white rounded-lg">
          <div className="p-8">
            <div className="text-center space-y-6">
              {/* 현재 모드 표시 */}
              <div className="flex items-center justify-center gap-2">
                {isWork ? (
                  <>
                    <Briefcase
                      className="h-6 w-6"
                      style={{ color: "#26374D" }}
                    />
                    <span
                      className="text-lg font-semibold"
                      style={{ color: "#26374D" }}
                    >
                      작업 시간
                    </span>
                  </>
                ) : (
                  <>
                    <Coffee
                      className="h-6 w-6"
                      style={{ color: "#9DB2BF" }}
                    />
                    <span
                      className="text-lg font-semibold"
                      style={{ color: "#9DB2BF" }}
                    >
                      휴식 시간
                    </span>
                  </>
                )}
              </div>

              {/* 원형 타이머 표시 */}
              <div className="relative flex items-center justify-center">
                <div className="relative w-64 h-64">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    {/* 배경 원 */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      className="text-gray-200"
                    />
                    {/* 진행 원 */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke={isWork ? "#26374D" : "#9DB2BF"}
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      className="transition-all duration-1000"
                      style={{
                        strokeDasharray: `${2 * Math.PI * 45}`,
                        strokeDashoffset: `${
                          2 *
                          Math.PI *
                          45 *
                          (1 - getProgress() / 100)
                        }`,
                      }}
                    />
                  </svg>

                  {/* 중앙 시간 표시 */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-4xl font-mono font-bold text-gray-800 mb-2">
                      {formatTime(timeLeft)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {isWork ? "작업 중" : "휴식 중"}
                    </div>
                  </div>
                </div>
              </div>

              {/* 사이클 카운터 */}
              <div className="text-sm text-gray-600">
                진행 상황:{" "}
                <span className="font-semibold text-gray-800">
                  {cycles}/{totalCycles}
                </span>{" "}
                사이클
              </div>

              {/* 컨트롤 버튼들 */}
              <div className="flex justify-center gap-3">
                <Button
                  onClick={toggleTimer}
                  size="lg"
                  disabled={isCompleted}
                  className={`px-8 text-white ${
                    isCompleted ? "opacity-50" : ""
                  }`}
                  style={{
                    backgroundColor: isWork
                      ? "#26374D"
                      : "#9DB2BF",
                    color: isWork ? "white" : "#27374D",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      isWork ? "#1e2c3d" : "#8aa0ad")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor =
                      isWork ? "#26374D" : "#9DB2BF")
                  }
                >
                  {isActive ? (
                    <>
                      <Pause className="h-5 w-5 mr-2" />
                      정지
                    </>
                  ) : (
                    <>
                      <Play className="h-5 w-5 mr-2" />
                      시작
                    </>
                  )}
                </Button>

                <Button
                  onClick={cancelTimer}
                  variant="outline"
                  size="lg"
                  className="px-6 bg-transparent"
                  style={{
                    color: isWork ? "#26374D" : "#9DB2BF",
                    borderColor: isWork ? "#26374D" : "#9DB2BF",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor =
                      isWork ? "#f0f2f5" : "#f3f6f8";
                    e.currentTarget.style.borderColor = isWork
                      ? "#1e2c3d"
                      : "#8aa0ad";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "transparent";
                    e.currentTarget.style.borderColor = isWork
                      ? "#26374D"
                      : "#9DB2BF";
                  }}
                >
                  취소
                </Button>
              </div>

              {/* 설명 텍스트 */}
              <div className="text-xs text-gray-500 mt-6">
                {isCompleted
                  ? "모든 세션이 완료되었습니다! 수고하셨습니다."
                  : isWork
                  ? `집중해서 작업하세요! ${workTime}분 후 휴식시간입니다.`
                  : `잠시 휴식을 취하세요. ${breakTime}분 후 다시 작업시간입니다.`}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
