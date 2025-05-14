import logoimage from "../assets/logo/logoimage.svg";
import signupimage from "../assets/signup/signup_img.svg";

const Signup = () => {
  return (
    <div className=" flex justify-center items-center w-[100vw] h-[100vh] bg-stone-700/60 shadow-[0.7483852505683899px_0px_2.9935410022735596px_0px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col justify-top items-center w-[435px] h-[620.58px] bg-[#F3F3E0] rounded-[50px]">
        {/* 로고 + 서비스명 */}
        <div className="w-44 inline-flex justify-center items-center gap-2.5 mt-[68.95px] mb-[26.15px]">
          <img
            src={logoimage}
            alt="로고 이미지"
            className="w-10 h-10"
          />
          <p className="justify-center text-blue-950 text-2xl font-semibold font-['Plus_Jakarta_Sans'] leading-loose">
            Schedulo
          </p>
        </div>

        {/* 회원 가입 로고 */}
        <div className="flex justify-center items-center gap-[3.27px] mb-[32.65px]">
          <img
            src={signupimage}
            alt="회원가입 이미지"
            className="w-5 h-5"
          />
          <p className="text-center justify-start text-zinc-900 text-xl font-normal font-['Noto_Sans_KR']">
            회원가입
          </p>
        </div>

        {/* 회원가입 입력 창 */}
        <div className="flex flex-col gap-2 w-36 h-7 rounded-xl mb-[0px]">
          <input type="email" />
          <input type="password" />
          <input type="password" />
        </div>

        {/* 이용약관 등 */}
        <div className="flex flex-col">
          <p className="text-stone-500 text-[10px] font-normal font-['Noto_Sans_KR']">
            [필수] 서비스 이용 약관 동의
          </p>
          <p className="text-stone-500 text-[10px] font-normal font-['Noto_Sans_KR']">
            [선택] 광고성 정보 수신 동의
          </p>
        </div>

        {/* 회원가입 버튼 */}
        <button className="w-40 h-10 px-12 py-6 left-0 top-0 bg-gradient-to-b from-white/70 to-white/40 rounded-2xl outline outline-[1.28px] outline-offset-[-1.28px] outline-white/80 backdrop-blur-[19.15px] inline-flex justify-center items-center gap-2">
          회원가입
        </button>
      </div>
    </div>
  );
};
export default Signup;
