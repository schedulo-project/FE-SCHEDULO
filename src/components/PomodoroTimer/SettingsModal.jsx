import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "./Button";

export default function SettingsModal({
  workTime,
  breakTime,
  totalCycles,
  onApply,
  onClose,
  isInitial = false,
}) {
  const [newWorkTime, setNewWorkTime] = useState(workTime);
  const [newBreakTime, setNewBreakTime] = useState(breakTime);
  const [newTotalCycles, setNewTotalCycles] =
    useState(totalCycles);

  const handleApply = () => {
    // 유효성 검사
    if (newWorkTime < 1 || newWorkTime > 120) {
      alert("작업 시간은 1분에서 120분 사이여야 합니다.");
      return;
    }
    if (newBreakTime < 1 || newBreakTime > 60) {
      alert("휴식 시간은 1분에서 60분 사이여야 합니다.");
      return;
    }
    if (newTotalCycles < 1 || newTotalCycles > 20) {
      alert("반복 횟수는 1회에서 20회 사이여야 합니다.");
      return;
    }

    onApply(newWorkTime, newBreakTime, newTotalCycles);
  };

  return (
    <div
      className={`${
        isInitial ? "" : "fixed inset-0 bg-black bg-opacity-50"
      } flex items-center justify-center p-4 z-50`}
    >
      <div className="w-[400px] max-w-md bg-white rounded-lg shadow-lg">
        <div className="w-full flex flex-row items-center justify-between space-y-0 pb-4 p-6">
          <h3 className="text-lg font-semibold">
            {isInitial ? "뽀모도로 타이머 설정" : "타이머 설정"}
          </h3>
          {!isInitial && (
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="flex flex-col justify-center items-center space-y-6 p-6 pt-0">
          {/* 작업 시간 설정 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              작업 시간 (분)
            </label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setNewWorkTime(Math.max(1, newWorkTime - 5))
                }
              >
                -5
              </Button>
              <input
                type="number"
                value={newWorkTime}
                onChange={(e) =>
                  setNewWorkTime(
                    Number.parseInt(e.target.value) || 1
                  )
                }
                className="w-20 text-center border rounded px-2 py-1"
                min="1"
                max="120"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setNewWorkTime(Math.min(120, newWorkTime + 5))
                }
              >
                +5
              </Button>
            </div>
          </div>

          {/* 휴식 시간 설정 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              휴식 시간 (분)
            </label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setNewBreakTime(Math.max(1, newBreakTime - 1))
                }
              >
                -1
              </Button>
              <input
                type="number"
                value={newBreakTime}
                onChange={(e) =>
                  setNewBreakTime(
                    Number.parseInt(e.target.value) || 1
                  )
                }
                className="w-20 text-center border rounded px-2 py-1"
                min="1"
                max="60"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setNewBreakTime(Math.min(60, newBreakTime + 1))
                }
              >
                +1
              </Button>
            </div>
          </div>

          {/* 반복 횟수 설정 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              반복 횟수
            </label>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setNewTotalCycles(
                    Math.max(1, newTotalCycles - 1)
                  )
                }
              >
                -1
              </Button>
              <input
                type="number"
                value={newTotalCycles}
                onChange={(e) =>
                  setNewTotalCycles(
                    Number.parseInt(e.target.value) || 1
                  )
                }
                className="w-20 text-center border rounded px-2 py-1"
                min="1"
                max="20"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setNewTotalCycles(
                    Math.min(20, newTotalCycles + 1)
                  )
                }
              >
                +1
              </Button>
            </div>
          </div>

          {/* 미리보기 */}
          <div className="bg-gray-50 p-3 rounded-lg text-sm">
            <div className="font-medium text-gray-700 mb-1">
              설정 미리보기:
            </div>
            <div className="text-gray-600">
              • 작업 {newWorkTime}분 → 휴식 {newBreakTime}분
              <br />• 총 {newTotalCycles}회 반복
              <br />• 예상 소요시간:{" "}
              {Math.floor(
                ((newWorkTime + newBreakTime) * newTotalCycles) /
                  60
              )}
              시간{" "}
              {((newWorkTime + newBreakTime) * newTotalCycles) %
                60}
              분
            </div>
          </div>

          {/* 버튼들 */}
          <div className="flex gap-3">
            <Button onClick={handleApply} className="flex-1">
              {isInitial ? "시작하기" : "적용"}
            </Button>
            {!isInitial && (
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-transparent"
              >
                취소
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
