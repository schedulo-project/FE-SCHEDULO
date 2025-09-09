import { useNavigate } from "react-router-dom";

const ExamPlanBtn = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/examplan");
  };

  return (
    <button
      onClick={handleClick}
      className="flex flex-col justify-center items-center w-[103.132px] h-[26.444px] bg-[#9DB2BF] text-[#27374D] text-[0.4958rem] tracking-[0.238px] rounded-[0.45rem] mb-[1.5rem] border border-[#526D8280]"
    >
      시험계획설정
    </button>
  );
};

export default ExamPlanBtn;
