import { Link, Outlet, useLocation } from "react-router-dom";

const paths = ["password", "exit", "smul"]; // 수정 가능한 경로 목록

const Profile = () => {
  const location = useLocation();

  // location.pathname 예: "/profile/password"
  // 현재 경로의 마지막 segment 가져오기
  const pathSegments = location.pathname.split("/");
  const lastSegment = pathSegments[pathSegments.length - 1];

  const isEditing = paths.includes(lastSegment);

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
    </div>
  );
};
export default Profile;
