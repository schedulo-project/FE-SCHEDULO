const Navbar = ({ onToggleSidebar }) => {
  return (
    <div className="w-full h-[2.1875rem] bg-[#010669] flex items-center justify-between px-4">
      {/* {md는 반응형에 사용되고 hidden을 적용해서 숨기다가 768px 아래로 내려가면 나옴.} */}
      <button
        className="text-white text-xl mr-4 lg:hidden pb-1"
        onClick={onToggleSidebar}
      >
        ☰
      </button>
      <span className="text-white font-semibold lg:hidden">
        Schedulo
      </span>
    </div>
  );
};

export default Navbar;
