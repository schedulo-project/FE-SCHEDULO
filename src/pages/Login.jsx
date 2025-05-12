import loginimage from "../assets/src/login/loginimage.jpg";
import loginicon from "../assets/src/login/loginicon.svg";
import logoimage from "../assets/src/logo/logoimage.svg";

const Login = () => {
  return (
    <div className="flex">
      <section className=" grow-[2] h-[100vh] border-solid border-2 border-black">
        {/* 로고 및 서비스명 */}
        <div className="flex gap-3">
          <img src={logoimage} alt="" />
          <p className="text-[26.46px]">Schedulo</p>
        </div>
        {/* 로그인 입력창 */}
        <div>
          <img src={loginicon} alt="로그인 아이콘" />
          <p className="text-[24.08px]">로그인</p>
        </div>
      </section>
      <section className="grow-[3] h-[100vh] border-solid border-2 border-black">
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
