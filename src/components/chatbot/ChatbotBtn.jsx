import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo/sasum.png";

const ChatbotBtn = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/chatbot");
  };
  return (
    <div className="relative w-[7.75rem] h-[6.95rem] bg-[#141522] rounded-[0.43rem] flex flex-col items-center justify-start">
      <div className="absolute top-[-2rem] left-[-2rem] w-[4.42288rem] h-[4.42288rem] bg-[#ffffff14] rounded-full"></div>
      <img
        src={logo}
        className="z-10 absolute flex items-center top-[-1rem] justify-center w-[2.5rem] h-[2.5rem] bg-[#141522] rounded-full border-[2.64px] border-white text-white text-[1.157rem] font-bold font-[Satoshi]"
      />
      <div className="z-0 relative top-[-7px] bg-[#608BC1] blur-[15.87px] w-[1.983rem] h-[1.818rem]"></div>
      <div className="flex flex-col items-center gap-[0.67rem] mt-[0.2rem]">
        <span className="text-[0.7rem] text-white font-[Plus Jakarta Sans] font-semibold mb-[1px]">
          Dulo AI
        </span>
        <button
          onClick={handleClick}
          className="w-[6.445rem] h-[1.65rem] bg-white rounded-[0.27644rem] text-[0.7rem] text-[#141522] font-[Plus Jakarta Sans] font-semibold"
        >
          질문하기
        </button>
      </div>
    </div>
  );
};

export default ChatbotBtn;
