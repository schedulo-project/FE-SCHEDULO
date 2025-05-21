import SideBox from "../SideBox";
import Navbar from "../Navbar";
import { Outlet, useLocation } from "react-router-dom";

const MainLayout = () => {
  const location = useLocation();

  return (
    <div className="flex flex-row w-full h-screen">
      {location.pathname !== "/study-plan" && <SideBox />}
      <div className="flex flex-col w-full min-w-[900px] h-screen overflow-scroll">
        <Navbar />
        <div className="p-4">
          <Outlet /> {/* 이 부분만 페이지마다 바뀜 */}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
