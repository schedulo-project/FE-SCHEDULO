import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  checkCurrentPassword,
  changePassword,
} from "../../api/settingApi";

function PasswordChange() {
  const [isPasswordChecked, setIsPasswordChecked] =
    useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] =
    useState("");

  const navigate = useNavigate();

  const handlePasswordChange = async (event) => {
    event.preventDefault();
    try {
      await changePassword({ newPassword });
      alert("비밀번호가 변경되었습니다.");
      navigate("/settings/profile");
    } catch (error) {
      alert("비밀번호 변경에 실패했습니다.");
      navigate("/settings/profile");
    }
  };

  const handlePasswordCheck = async () => {
    if (!currentPassword) {
      alert("현재 비밀번호를 입력해주세요.");
      return;
    }
    try {
      await checkCurrentPassword({ currentPassword });
      setIsPasswordChecked(true);
    } catch (error) {
      alert("비밀번호 확인에 실패했습니다.");
      navigate("/settings/profile");
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full bg-white p-5 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4">비밀번호 변경</h3>
      <section className="relative flex items-center gap-2 mb-10 w-60">
        <input
          className={`w-full h-10 p-2 rounded shadow-md border absolute left-0 ${
            isPasswordChecked
              ? "bg-gray-100 text-gray-500 cursor-not-allowed border-gray-200"
              : "bg-white border-gray-300"
          }`}
          type="password"
          placeholder="현재 비밀번호"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
        <button
          onClick={handlePasswordCheck}
          disabled={isPasswordChecked || !currentPassword}
          className={`h-6 w-10 rounded-xl text-[0.8rem] absolute right-1 z-2 ${
            isPasswordChecked
              ? "bg-green-500 text-white cursor-default"
              : !currentPassword
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-slate-500 text-slate-200 hover:bg-slate-600"
          }`}
        >
          확인
        </button>
      </section>
      {isPasswordChecked && (
        <p className="text-green-500 mt-[-1.5rem]">
          비밀번호가 확인되었습니다.
        </p>
      )}
      <form
        onSubmit={handlePasswordChange}
        className="flex flex-col gap-4"
      >
        <input
          className={`w-60 h-10 p-2 rounded shadow-md border ${
            !isPasswordChecked
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
              : "bg-white border-gray-300"
          }`}
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="새 비밀번호"
        />
        <input
          className={`w-60 h-10 p-2 rounded shadow-md border ${
            !isPasswordChecked
              ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
              : "bg-white border-gray-300"
          }`}
          type="password"
          value={newPasswordConfirm}
          onChange={(e) => setNewPasswordConfirm(e.target.value)}
          placeholder="새 비밀번호 확인"
        />
        {newPassword !== newPasswordConfirm &&
          newPasswordConfirm !== "" && (
            <p className="text-red-500">
              비밀번호가 일치하지 않습니다.
            </p>
          )}

        <button
          type="submit"
          disabled={
            !isPasswordChecked ||
            newPassword !== newPasswordConfirm ||
            !newPassword ||
            !newPasswordConfirm
          }
          className={`px-4 py-2 text-sm rounded mt-4 ${
            !isPasswordChecked ||
            newPassword !== newPasswordConfirm ||
            !newPassword ||
            !newPasswordConfirm
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          변경
        </button>
      </form>
    </div>
  );
}

export default PasswordChange;
