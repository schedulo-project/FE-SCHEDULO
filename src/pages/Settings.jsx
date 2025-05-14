import { Link, Outlet, useLocation } from "react-router-dom";
import PasswordChange from "../components/settingsDetail/PasswordChange";

function Settings() {
  const tabs = [
    { label: "프로필", path: "profile" },
    { label: "알림", path: "alarm" },
    { label: "공부계획설정", path: "studyplan" },
    { label: "통계 및 시각화", path: "data" },
  ];

  const location = useLocation();

  const renderSettingComponent = () => {
    if (
      location.pathname.startsWith("/settings/profile/password")
    ) {
      return <PasswordChange />;
    }
    // 추가적으로 다른 설정들 처리 가능
  };

  return (
    <div className="flex justify-center w-full p-5 scroll-m-0">
      <section className="w-full min-w-[25.25rem] max-w-[40.25rem] bg-[#F0F0F0] min-h-[15.4375rem] p-[1.36rem]">
        {/* {버튼 컨테이너 부분} */}
        <div className="flex justify-start h-[3.343rem] bg-white">
          {tabs.map(({ label, path }) => (
            <Link
              key={path}
              to={`/settings/${path}`}
              className={`text-[#141522] text-[0.79631rem] p-5 font-semibold ${
                location.pathname.includes(path)
                  ? "border-b-2 border-[#546FFF]"
                  : "text-[#8E92BC]"
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
        {/* {여기에 btnStringArr에 맞는 컴포넌트 넣기} */}
        <Outlet />
      </section>

      {/* {설정창에 오른쪽에 추가되는 양식이 추가되면 startWith에 or로 조건 링크로 추가하고 renderSettingComponent에 조건에 따른 그려야되는 컴포넌트 넣어줘야함} */}
      {/* 아래 코드가 원래 왔던 자리 */}
    </div>
  );
}

export default Settings; // 반드시 있어야 함!

{
  /* <section
className={`grow-[1] min-w-[25.25rem] max-w-[40.25rem] min-h-[10.4375rem] p-5
  ${
    location.pathname.startsWith(
      "/settings/profile/password"
    )
      ? "bg-[#F0F0F0]"
      : "bg-white"
  }
  `}
>
{renderSettingComponent()}
</section> */
}
