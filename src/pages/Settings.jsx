import { useState } from "react";

function Settings() {
  const btnStringArr = [
    "프로필",
    "알림",
    "공부계획설정",
    "통계 및 시각화",
  ];
  const [activeTab, setActiveTab] = useState("프로필");

  return (
    <div className="flex justify-center w-full p-5 scroll-m-0">
      <section className="grow-[1] min-w-[25.25rem] max-w-[30.25rem] bg-[#F0F0F0] min-h-[10.4375rem] p-[1.36rem]">
        <div className="flex justify-start gap-[1.26rem] h-[3.343rem] bg-white pl-[1rem]">
          {btnStringArr.map((btnString, index) => (
            <button
              key={index}
              className="text-[#141522] text-[0.79631rem] font-[Plus Jakarta Sans] font-semibold"
            >
              {btnString}
            </button>
          ))}
          {/* {버튼을 누르게 되면 border-bottom이 파란색으로 하이라이트 되야함 또한 하이라이트 된 글자만 검정 나머지는 회색으로 해야함} */}
        </div>
        {/* {여기에 btnStringArr에 맞는 컴포넌트 넣기} */}
      </section>
      <section className="grow-[1] min-w-[25.25rem] max-w-[30.25rem] bg-[] min-h-[10.4375rem]">
        {/* {여기에 btnStringArr에 맞는 컴포넌트가 나오면 몇개는 버튼이 있는데 그걸 클릭하면 옆에 나오게 될 추가 설정창} */}
      </section>
    </div>
  );
}

export default Settings; // 반드시 있어야 함!
