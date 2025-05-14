import loginimage from "../assets/login/loginimage.jpg";
import loginicon from "../assets/login/loginicon.svg";
import logoimage from "../assets/logo/logoimage.svg";

const Login = () => {
  return (
    <div className="flex">
      <section className="flex flex-col justify-center  gap-[30.67px] w-[50vw] h-[100vh] bg-[#F3F3E0] border-solid border-2 border-black">
        {/* 로고 및 서비스명 */}
        <div className="w-44 inline-flex justify-start items-center gap-2.5 ml-[58.07px]">
          <img
            src={logoimage}
            alt="로고 이미지"
            className="w-12 h-12 relative"
          />
          <p className="justify-center text-blue-950 text-2xl font-semibold font-['Plus_Jakarta_Sans'] leading-10">
            Schedulo
          </p>
        </div>

        {/* 로그인 */}
        <div className="flex flex-col items-center gap-10">
          {/* 로그인 아이콘 + 텍스트 */}
          <div className="flex gap-1">
            <img
              src={loginicon}
              alt="로그인 아이콘"
              className="w-6 h-6 relative overflow-hidden"
            />
            <p className="text-center justify-start text-zinc-900 text-2xl font-normal font-['Noto_Sans_KR']">
              로그인
            </p>
          </div>
          {/* 로그인 입력창 */}
          <div className="flex flex-col gap-3 items-center">
            <input
              className="text-[8.39px] w-[152px] h-[28px] rounded-[4.2px] placeholder:text-black font-light pl-2 shadow-[0px_2.1040303707122803px_4.2080607414245605px_0px_rgba(0,0,0,0.12)]"
              type="email"
              placeholder="이메일"
            />
            <input
              className="text-[8.39px] w-[152px] h-[28px] rounded-[4.2px] placeholder:text-black font-light pl-2 shadow-[0px_2.1040303707122803px_4.2080607414245605px_0px_rgba(0,0,0,0.12)]"
              type="password"
              placeholder="비밀번호"
            />
          </div>

          {/* 로그인 버튼 */}
          <button className="w-48 h-11 px-16 py-6 mt-16 bg-gradient-to-b from-white/70 to-white/40 rounded-[19px] outline outline-[1.50px] outline-offset-[-1.50px] outline-white/80 backdrop-blur-xl inline-flex justify-center items-center gap-2.5 text-base text-zinc-900 font-medium leading-snug">
            로그인
          </button>
        </div>

        {/* pw 찾기 및 회원가입 */}
        <div className="flex flex-col gap-[15px] items-center">
          <div className="w-[98px] h-[14px] text-center justify-start text-stone-500 text-[10px] font-normal font-['Inter'] leading-3 border-b border-stone-500 cursor-pointer">
            비밀번호를 잊으셨나요?
          </div>
          <div className="w-[37px] h-[14px] text-center justify-start text-stone-500 text-[10px] font-normal font-['Inter'] leading-3 border-b border-stone-500 cursor-pointer">
            회원가입
          </div>
        </div>
      </section>

      {/* 로그인 오른쪽 그림 화면 */}
      <section className="w-[50vw] h-[100vh] border-solid border-2 border-black">
        <img
          className="w-[100%] h-[100%]"
          src={loginimage}
          alt="로그인 이미지"
        />
      </section>
    </div>
  );
};

export default Login;
