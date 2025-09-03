import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changeSamwater } from "../../api/settingApi";

const SamwaterChange = () => {
  const [samwaterId, setSamwaterId] = useState("");
  const [samwaterPassword, setSamwaterPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await changeSamwater({ samwaterId, samwaterPassword });
      alert("샘물 정보가 수정되었습니다.");
      navigate("/settings/profile");
    } catch (error) {
      alert("샘물 정보 수정에 실패했습니다.");
      navigate("/settings/profile");
    }
  };

  const inputSytle =
    "w-60 h-10 p-2 rounded shadow-md border bg-white border-gray-300";

  return (
    <div className="flex flex-col gap-4 w-full bg-white p-5 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold mb-4">샘물 정보 수정</h3>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        <input
          className={inputSytle}
          type="text"
          value={samwaterId}
          onChange={(e) => setSamwaterId(e.target.value)}
          placeholder="새 샘물 아이디"
        />
        <input
          className={inputSytle}
          type="password"
          value={samwaterPassword}
          onChange={(e) => setSamwaterPassword(e.target.value)}
          placeholder="새 샘물 비밀번호"
        />
        <button
          type="submit"
          disabled={samwaterId === "" || samwaterPassword === ""}
          className={`px-4 py-2 text-sm rounded mt-4 ${
            samwaterId === "" || samwaterPassword === ""
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
        >
          수정
        </button>
      </form>
    </div>
  );
};

export default SamwaterChange;
