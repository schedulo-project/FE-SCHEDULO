import { Link } from "react-router-dom";
import deleteUser from "../../api/deleteUser";

const ExitUser = () => {
  const handleExit = async () => {
    // try {
    //   const res = await deleteUser();
    // 성공 처리
    // if (res.status === 204) {
    //   console.log("회원 탈퇴 성공");
    // 예: 로그아웃 처리, 홈 리디렉션 등
    // } else {
    //   alert("회원 탈퇴 실패");
    // 홈으로 이동
    // }
    // } catch (error) {
    // 실패 처리 (유저 알림, 로그 등)
    // alert("회원 탈퇴 중 오류 발생");
    // 홈으로 이동
    // }
    console.log("회원 탈퇴 클릭됨");
  };

  return (
    <div className="flex flex-col w-full bg-white p-5 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4">회원 탈퇴</h3>
      <p className="mb-6">
        정말 탈퇴하시겠습니까? 탈퇴 시 모든 정보가 삭제됩니다.
      </p>
      <section className="flex gap-4 justify-end">
        <Link
          to=".."
          className="inline-flex items-center justify-center bg-[#546FFF] text-white px-4 py-2 text-sm rounded"
        >
          아니요
        </Link>
        <button
          onClick={handleExit}
          className="inline-flex items-center justify-center bg-[#A0A0A0] text-white px-4 py-2 text-sm rounded"
        >
          네, 탈퇴하겠습니다.
        </button>
      </section>
    </div>
  );
};

export default ExitUser;
