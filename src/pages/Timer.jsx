import { useState, useEffect, useRef } from "react";
import { Play, Pause, Coffee, Briefcase } from "lucide-react";
import { Button } from "../components/PomodoroTimer/Button";
import SettingsModal from "../components/PomodoroTimer/SettingsModal";

export default function Timer() {
  // 앱 상태 관리
  const [appState, setAppState] = useState("setup"); // 'setup' 또는 'timer'

  // 설정 상태
  const [workTime, setWorkTime] = useState(25); // 분 단위
  const [breakTime, setBreakTime] = useState(5); // 분 단위
  const [totalCycles, setTotalCycles] = useState(4); // 총 반복 횟수

  const [timeLeft, setTimeLeft] = useState(25 * 60); // 초 단위
  const [isActive, setIsActive] = useState(false);
  const [isWork, setIsWork] = useState(true);
  const [cycles, setCycles] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false); // 전체 세션 완료 상태
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isActive && timeLeft > 0 && !isCompleted) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isCompleted) {
      // 타이머 완료
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
      setIsActive(false);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [
    isActive,
    timeLeft,
    isWork,
    workTime,
    breakTime,
    cycles,
    totalCycles,
    isCompleted,
  ]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const cancelTimer = () => {
    setIsActive(false);
    setIsWork(true);
    setCycles(0);
    setIsCompleted(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setAppState("setup"); // 설정 화면으로 돌아가기
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const getProgress = () => {
    const totalTime = isWork ? workTime * 60 : breakTime * 60;
    return ((totalTime - timeLeft) / totalTime) * 100;
  };

  const applySettings = (
    newWorkTime,
    newBreakTime,
    newTotalCycles
  ) => {
    setWorkTime(newWorkTime);
    setBreakTime(newBreakTime);
    setTotalCycles(newTotalCycles);
    setTimeLeft(newWorkTime * 60);
    setIsWork(true);
    setCycles(0);
    setIsCompleted(false);
    setAppState("timer"); // 타이머 화면으로 전환
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {appState === "setup" ? (
        <SettingsModal
          workTime={workTime}
          breakTime={breakTime}
          totalCycles={totalCycles}
          onApply={applySettings}
          onClose={() => {}} // 초기 화면에서는 닫기 불가
          isInitial={true}
        />
      ) : (
        <div className="w-full max-w-md mx-auto shadow-2xl bg-white rounded-lg">
          <div className="p-8">
            <div className="text-center space-y-6">
              {/* 현재 모드 표시 */}
              <div className="flex items-center justify-center gap-2">
                {isCompleted ? (
                  <div className="text-lg font-semibold text-purple-600">
                    🎉 모든 세션 완료!
                  </div>
                ) : isWork ? (
                  <>
                    <Briefcase className="h-6 w-6 text-blue-600" />
                    <span className="text-lg font-semibold text-blue-600">
                      작업 시간
                    </span>
                  </>
                ) : (
                  <>
                    <Coffee className="h-6 w-6 text-green-600" />
                    <span className="text-lg font-semibold text-green-600">
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
                      stroke="currentColor"
                      strokeWidth="8"
                      fill="none"
                      strokeLinecap="round"
                      className={`transition-all duration-1000 ${
                        isWork
                          ? "text-blue-500"
                          : "text-green-500"
                      }`}
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
                  className={`px-8 ${
                    isWork
                      ? "bg-blue-600 hover:bg-blue-700"
                      : "bg-green-600 hover:bg-green-700"
                  } ${isCompleted ? "opacity-50" : ""}`}
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
