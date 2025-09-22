import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import ToggleForSettings from "./ToggleForSettings";
import {
  alarmToggle,
  getAlarmState,
} from "../../api/settingApi";

const paths = ["password", "exit", "smul"]; // 수정 가능한 경로 목록

const Profile = () => {
  const location = useLocation();

  // location.pathname 예: "/profile/password"
  // 현재 경로의 마지막 segment 가져오기
  const pathSegments = location.pathname.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];

  const isEditing = paths.includes(lastSegment);

  //--- 알림 설정 관련 코드 ---
  // 메인 토글 상태
  const [mainOn, setMainOn] = useState(false);
  // 세부 토글 상태
  const [sub1, setSub1] = useState(false);
  const [sub2, setSub2] = useState(false);

  useEffect(() => {
    async function fetchAlarmState() {
      try {
        const data = await getAlarmState();
        if (data) {
          if (
            data.notify_deadline_schedule ||
            data.notify_today_schedule
          ) {
            setMainOn(true);
            setSub1(data.notify_today_schedule);
            setSub2(data.notify_deadline_schedule);
          }
        }
      } catch (error) {
        alert("알림 설정 값을 불러오지 못했습니다.");
      }
    }
    fetchAlarmState();
  }, []);

  // 메인 토글 핸들러 (롤백 포함)
  const handleMainToggle = async (checked) => {
    const prev = { mainOn, sub1, sub2 };
    setMainOn(checked);
    setSub1(checked);
    setSub2(checked);
    try {
      await alarmToggle({
        today: checked ? 1 : 0,
        deadline: checked ? 1 : 0,
      });
    } catch (error) {
      // rollback
      setMainOn(prev.mainOn);
      setSub1(prev.sub1);
      setSub2(prev.sub2);
      alert("알림 설정에 실패했습니다.");
    }
  };

  // 오늘 할일 토글 핸들러 (롤백 포함)
  const handleTodayToggle = async (checked) => {
    const prev = sub1;
    setSub1(checked);
    try {
      await alarmToggle({
        today: checked ? 1 : 0,
        deadline: sub2 ? 1 : 0,
      });
    } catch {
      setSub1(prev);
      alert("알림 설정에 실패했습니다.");
    }
  };

  // 마감 기한 토글 핸들러 (롤백 포함)
  const handleDeadlineToggle = async (checked) => {
    const prev = sub2;
    setSub2(checked);
    try {
      await alarmToggle({
        today: sub1 ? 1 : 0,
        deadline: checked ? 1 : 0,
      });
    } catch {
      setSub2(prev);
      alert("알림 설정에 실패했습니다.");
    }
  };

  //--- 공부 계획 설정 관련 코드 ---
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/studyplan/setup");
  };

  return (
    <div className="pt-5 flex flex-col gap-5">
      <section className="flex flex-col items-start">
        <h1 className="font-semibold font-['Inter'] text-s ">
          개인정보 수정
        </h1>
        <hr className="w-[40%] bg-black mt-2 mb-2" />
        {isEditing ? (
          <Link
            to="."
            className="text-xs font-normal font-['Inter'] mb-3"
          >
            취소
          </Link>
        ) : (
          <div className="flex flex-col gap-4">
            <Link
              to="password"
              className="text-xs font-normal font-['Inter'] "
            >
              비밀번호 변경
            </Link>
            <Link
              to="smul"
              className="text-xs font-normal font-['Inter'] "
            >
              샘물 정보 수정
            </Link>
            <Link
              to="exit"
              className="text-xs text-red-500 underline font-normal font-['Inter'] "
            >
              회원 탈퇴
            </Link>
          </div>
        )}
        <Outlet />
      </section>
      <section className="flex flex-col items-start">
        <h1 className="font-semibold font-['Inter'] text-s ">
          알림 수정
        </h1>
        <hr className="w-[40%] bg-black mt-2 mb-2" />
        <div className="flex flex-col justify-between w-full gap-4">
          <ToggleForSettings
            name="전체 알림"
            checked={mainOn}
            onChange={(e) => handleMainToggle(e.target.checked)}
            disabled={false}
            size="lg"
          />
          <ToggleForSettings
            name="오늘 할일 알림"
            checked={sub1}
            onChange={(e) => handleTodayToggle(e.target.checked)}
            disabled={!mainOn}
            size="md"
          />
          <ToggleForSettings
            name="마감 기한 알림"
            checked={sub2}
            onChange={(e) =>
              handleDeadlineToggle(e.target.checked)
            }
            disabled={!mainOn}
            size="md"
          />
        </div>
      </section>
      <section className="flex flex-col items-start">
        <h1 className="font-semibold font-['Inter'] text-s ">
          공부 계획 설정
        </h1>
        <hr className="w-[40%] bg-black mt-2 mb-2" />
        <button
          onClick={handleStart}
          className="bg-[#27374D] h-[48px] w-[50%] text-lg text-white px-6 py-3 rounded-3xl font-semibold hover:bg-[#8BA3B0] transition"
        >
          수정하러 가기
        </button>
      </section>
    </div>
  );
};

export default Profile;
