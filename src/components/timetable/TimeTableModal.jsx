import { useState, useEffect } from "react";
import baseAxiosInstance from "../../api/baseAxiosApi";
import { ChevronDown } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const days = ["월", "화", "수", "목", "금", "토", "일"];
const hours = Array.from({ length: 15 }, (_, i) => i + 9);

// 공통 input/select 스타일
const baseInputClass =
  "w-[180px] h-[35px] border rounded-lg px-2 py-1 shadow-sm focus:outline-none focus:ring-0";

// 공통 Label + Input 컴포넌트
const LabeledField = ({ label, children }) => (
  <div className="flex flex-col gap-1">
    <label className="pl-1">{label}</label>
    {children}
  </div>
);

const SubjectInput = ({ subject, index, handleChange }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const CustomDropdown = ({
    value,
    options,
    onSelect,
    dropdownKey,
    formatOption = (option) => option,
  }) => {
    const isOpen = openDropdown === dropdownKey;

    return (
      <div className="relative">
        {/* 선택 영역 */}
        <div
          onClick={() =>
            setOpenDropdown(isOpen ? null : dropdownKey)
          }
          className={`${baseInputClass} bg-white shadow-sm cursor-pointer flex justify-between items-center`}
        >
          <span className="flex-1 text-center">
            {formatOption(value)}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* 옵션 목록 */}
        {isOpen && (
          <div className="absolute top-full left-0 w-[180px] mt-1 bg-white border border-gray-200 rounded-lg shadow-md z-10 max-h-32 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option}
                onClick={() => {
                  onSelect(option);
                  setOpenDropdown(null);
                }}
                className="px-2 py-1 hover:bg-gray-100 cursor-pointer text-center"
              >
                {formatOption(option)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-3 mb-6">
      <LabeledField label="과목명">
        <input
          type="text"
          value={subject.name}
          onChange={(e) =>
            handleChange(index, "name", e.target.value)
          }
          className={baseInputClass}
        />
      </LabeledField>

      <LabeledField label="교수명">
        <input
          type="text"
          value={subject.professor}
          onChange={(e) =>
            handleChange(index, "professor", e.target.value)
          }
          className={baseInputClass}
        />
      </LabeledField>

      <LabeledField label="요일">
        <CustomDropdown
          value={subject.day}
          options={days}
          onSelect={(value) => handleChange(index, "day", value)}
          dropdownKey="day"
        />
      </LabeledField>

      <LabeledField label="시간">
        <div className="flex justify-between items-center w-full gap-2">
          <CustomDropdown
            value={subject.startHour}
            options={hours}
            onSelect={(value) =>
              handleChange(index, "startHour", value)
            }
            dropdownKey="startHour"
            formatOption={(hour) => `${hour}:00`}
          />
          <span>~</span>
          <CustomDropdown
            value={subject.endHour}
            options={hours}
            onSelect={(value) =>
              handleChange(index, "endHour", value)
            }
            dropdownKey="endHour"
            formatOption={(hour) => `${hour}:00`}
          />
        </div>
      </LabeledField>

      <LabeledField label="장소">
        <input
          type="text"
          value={subject.location}
          onChange={(e) =>
            handleChange(index, "location", e.target.value)
          }
          className={baseInputClass}
        />
      </LabeledField>
    </div>
  );
};

const TimeTableModal = ({
  onSubmit,
  onClose,
  onDelete,
  schedule,
  editingSubject,
  isLoading = false,
}) => {
  const [subjects, setSubjects] = useState([
    {
      name: "",
      professor: "",
      day: "월",
      startHour: 9,
      endHour: 10,
      location: "",
    },
  ]);

  // 편집 모드일 때 데이터 설정
  useEffect(() => {
    if (editingSubject) {
      setSubjects([
        {
          name: editingSubject.name || "",
          professor: editingSubject.professor || "",
          day: editingSubject.day || "월",
          startHour: Math.floor(editingSubject.startHour) || 9,
          endHour: Math.floor(editingSubject.endHour) || 10,
          location: editingSubject.location || "",
        },
      ]);
    } else {
      setSubjects([
        {
          name: "",
          professor: "",
          day: "월",
          startHour: 9,
          endHour: 10,
          location: "",
        },
      ]);
    }
  }, [editingSubject]);

  const handleChange = (index, field, value) => {
    setSubjects((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleSubmit = () => {
    try {
      // 입력 검증: 과목명, 시간 유효성 체크
      for (const subject of subjects) {
        if (!subject.name.trim()) {
          alert("과목명을 입력해주세요.");
          return;
        }
        if (subject.startHour >= subject.endHour) {
          alert("시작 시간은 종료 시간보다 빨라야 합니다.");
          return;
        }
      }

      // 시간 겹침 검사
      for (const subject of subjects) {
        const newStart = subject.startHour;
        const newEnd = subject.endHour;
        const newDay = subject.day;

        // 기존 시간표(schedule)와 비교
        const overlapInExisting = (schedule || []).some((s) => {
          if (
            !s ||
            typeof s.startHour === "undefined" ||
            typeof s.endHour === "undefined" ||
            !s.day
          ) {
            return false;
          }

          if (editingSubject && s.id === editingSubject.id) {
            return false;
          }

          if (s.day !== newDay) return false;

          // 겹침 여부 계산
          const isOverlap =
            newStart < s.endHour && newEnd > s.startHour;
          return isOverlap;
        });

        if (overlapInExisting) {
          alert(
            `${subject.name}의 시간이 기존 시간표와 겹칩니다. 다른 시간을 선택해주세요.`
          );
          return;
        }
      }

      onSubmit(subjects);

      if (!editingSubject) {
        setSubjects([
          {
            name: "",
            professor: "",
            day: "월",
            startHour: 9,
            endHour: 10,
            location: "",
          },
        ]);
      }
    } catch (error) {
      console.error("시간표 처리 오류:", error);
      alert("시간표 처리 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
    }
  };

  const modalTitle = editingSubject ? "강의 수정" : "강의 추가";
  const submitButtonText = editingSubject
    ? "수정하기"
    : "추가하기";

  return (
    <div className="w-[480px] rounded-[20px] overflow-hidden shadow-lg">
      <div className="h-[75px] bg-[#526D82] text-white flex justify-between items-center px-8">
        <h3 className="text-lg font-semibold">{modalTitle}</h3>
        <button
          onClick={onClose}
          className="text-white hover:opacity-80"
        >
          ✕
        </button>
      </div>

      <div className="bg-[#F0F0F0] p-8">
        {subjects.map((subject, index) => (
          <SubjectInput
            key={index}
            subject={subject}
            index={index}
            handleChange={handleChange}
          />
        ))}
        <div className="flex gap-4 justify-end">
          {/* 삭제 버튼 (편집 모드일 때만 표시) */}
          {editingSubject && onDelete && (
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-[#6C757D] text-white rounded-3xl px-4 py-2 text-sm hover:bg-[#495057] disabled:opacity-50"
            >
              {isLoading ? "처리중..." : "삭제"}
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="bg-[#526D82] text-white rounded-3xl px-4 py-2 text-sm hover:opacity-90"
          >
            {isLoading ? "처리중..." : submitButtonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TimeTableModal;
