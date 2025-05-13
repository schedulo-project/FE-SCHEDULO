import SideBox from "../SideBox";
import Navbar from "../Navbar";
import { Outlet } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="flex flex-row w-full h-screen">
      <SideBox />
      <div className="flex flex-col w-full h-screen">
        <Navbar />
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet /> {/* 이 부분만 페이지마다 바뀜 */}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
