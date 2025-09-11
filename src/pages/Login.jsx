import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import logoimage from "../assets/logo/logoimage.svg";
import loginIcon from "../assets/login/loginicon.svg";
import loginApi from "../api/Auth/loginApi";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError("");

    try {
      const response = await loginApi(data.email, data.password);
      if (response.success) {
        login(response.access, response.refresh);
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.error("로그인 실패:", error);
      setLoginError("이메일 또는 비밀번호가 올바르지 않습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-8 p-8 max-w-md mx-auto">
      {/* 로고 및 서비스명 */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <img
          src={logoimage}
          alt="로고 이미지"
          className="w-48 h-auto"
        />
      </div>

      <div className="flex items-center gap-2">
        <img
          src={loginIcon}
          alt="로그인 아이콘"
          className="w-6 h-6"
        />
        <span className="text-xl">로그인</span>
      </div>

      {/* 에러 메시지 */}
      {loginError && (
        <div className="w-full p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-center">
          {loginError}
        </div>
      )}
      {/* 로그인 입력창 */}
      <form
        className="w-full flex flex-col gap-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-full">
          <input
            className={`w-full p-3 rounded-md bg-gray-100 text-sm ${
              errors.email ? "border border-red-500" : ""
            }`}
            placeholder="이메일"
            {...register("email", {
              required: "이메일을 입력해주세요",
              pattern: {
                value:
                  /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "올바른 이메일 형식이 아닙니다",
              },
            })}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="w-full">
          <input
            className={`w-full p-3 rounded-md bg-gray-100 text-sm ${
              errors.password ? "border border-red-500" : ""
            }`}
            type="password"
            placeholder="비밀번호"
            {...register("password", {
              required: "비밀번호를 입력해주세요",
              minLength: {
                value: 4,
                message: "비밀번호는 최소 4자 이상이어야 합니다",
              },
            })}
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full p-3 bg-[#2D3748] text-white rounded-md mt-6 text-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "로그인 중..." : "로그인"}
        </button>
      </form>
      {/* 회원가입 안내 */}
      <div className="mt-6 text-center">
        <span className="text-sm text-gray-500">
          아직 계정이 없으신가요?
        </span>
        <a
          href="/signup"
          className="text-sm text-[#2D3748] hover:underline ml-2 font-medium"
        >
          회원가입
        </a>
      </div>
    </div>
  );
};

export default Login;
