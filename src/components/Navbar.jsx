import { useNavigate } from "react-router-dom";

const Navbar = ({ onToggleSidebar }) => {
  const navigator = useNavigate();
  return (
    <div className="w-full h-[2.1875rem] bg-[#27374D] flex items-center justify-between px-4">
      {/* {md는 반응형에 사용되고 hidden을 적용해서 숨기다가 768px 아래로 내려가면 나옴.} */}
      <button
        className="text-white text-xl mr-4 lg:hidden pb-1"
        onClick={onToggleSidebar}
      >
        ☰
      </button>
      <span
        className="text-white font-mono lg:hidden cursor-pointer"
        onClick={() => {
          navigator("/");
        }}
      >
        Schedulo
      </span>
    </div>
  );
};

export default Navbar;
