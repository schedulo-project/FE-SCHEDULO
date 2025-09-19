import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { deleteUser } from "../../api/settingApi";

const ExitUser = () => {
  const navigate = useNavigate();

  const handleExit = async () => {
    //일정 삭제
    try {
      const res = await deleteUser();
      if (res.status === 204) {
        alert("회원 탈퇴에 성공하였습니다.");
        navigate("/login");
      } else {
        alert("회원 탈퇴에 실패하였습니다.");
        navigate("/settings/profile");
      }
    } catch (error) {
      alert("회원 탈퇴 중 오류가 발생하였습니다.");
      navigate("/settings/profile");
    }
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
