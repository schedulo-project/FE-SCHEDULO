import { useNavigate } from "react-router-dom";

const ChatbotBtn = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/chatbot");
  };
  return (
    <div className="relative w-[5.1875rem] h-[4.52056rem] bg-[#141522] rounded-[0.27644rem] flex flex-col items-center justify-start ">
      <div className="absolute top-[-3rem] left-[-3rem] w-[4.42288rem] h-[4.42288rem] bg-[#ffffff14] rounded-full"></div>
      <div
        className="z-10 absolute flex items-center top-[-0.8rem] justify-center w-[1.32688rem] h-[1.32688rem] bg-[#141522] rounded-full border-[1.769px] border-white text-white text-[0.774rem] font-bold font-[Satoshi]
"
      >
        ?
      </div>
      <div className="z-0 relative top-[-0.7rem]  bg-[#608BC1] blur-[5.30747127532959px] w-[1.32688rem] h-[1.32688rem]"></div>
      <span className="text-[0.44231rem] text-white font-[Plus Jakarta Sans] font-semibold">
        AI챗봇
      </span>
      <button
        onClick={handleClick}
        className="w-[4.31231rem] h-[1.10575rem] bg-white rounded-[0.27644rem] text-[0.33169rem] text-[#141522] font-[Plus Jakarta Sans] font-semibold mt-[0.67rem]"
      >
        질문하기
      </button>
    </div>
  );
};

export default ChatbotBtn;
