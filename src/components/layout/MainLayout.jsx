import { useState, useEffect } from "react";
import SideBox from "../SideBox";
import Navbar from "../Navbar";
import { Outlet, useLocation } from "react-router-dom";

const MainLayout = () => {
  const location = useLocation();
  const [showSidebar, setShowSidebar] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    window.innerWidth
  );

  // 화면 크기 감지하는 훅
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () =>
      window.removeEventListener("resize", handleResize);
  }, []);

  //화면이 커질 때 사이드 바 열린 상태 초기화
  useEffect(() => {
    if (windowWidth >= 1023) {
      setShowSidebar(false);
    }
  }, [windowWidth, showSidebar, setShowSidebar]);

  const shouldHideSidebar = location.pathname === "/study-plan";

  return (
    <div className="flex w-full h-screen relative">
      {!shouldHideSidebar && (
        <>
          {/* 사이드바: showSidebar 상태로 제어 작아지면 사라지고 햄버거 버튼을 눌러야지 나온다. */}
          {/* {translate-x-0" : "-translate-x-full 는 이동시키는 코드인데 full은 넓이 만큼 이동 시키고 0은 원래 위치로 이동} */}
          <div
            className={`fixed z-40 top-0 left-0 h-full transition-transform duration-400 lg:static lg:translate-x-0 ${
              showSidebar ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <SideBox
              closeSidebar={() => setShowSidebar(false)}
            />
          </div>

          {/* 사이드바 열릴 때 배경 어둡게 하기 위한 코드이다. */}
          {/* inset: 0이라고 쓰면 top: 0, right: 0, bottom: 0, left: 0 과 동일하다. */}
          {showSidebar && (
            <div
              className="fixed inset-0 bg-black opacity-30 z-30 lg:hidden"
              onClick={() => setShowSidebar(false)}
            />
          )}
        </>
      )}

      <div className="flex flex-col w-full h-screen z-10">
        {/* shrink-0을 하면 줄어 들지 않음 */}
        <div className="shrink-0">
          <Navbar
            onToggleSidebar={() => setShowSidebar(!showSidebar)}
          />
        </div>

        {/* Outlet은 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
