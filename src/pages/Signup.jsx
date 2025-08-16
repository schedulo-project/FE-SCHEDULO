import { useForm } from "react-hook-form";
import logoimage from "../assets/logo/logoimage.svg";

const Signup = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = (data) => {
    console.log(data);
    // 여기에 회원가입 API 호출 로직 추가
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-white p-4">
      <div className="flex flex-col items-center max-w-md w-full">
        {/* 로고 + 서비스명 */}
        <div className="flex items-center gap-2 mb-8">
          <img
            src={logoimage}
            alt="로고 이미지"
            className="w-10 h-10"
          />
          <p className="text-[#2D3748] text-2xl font-semibold">
            Schedulo
          </p>
        </div>

        {/* 회원가입 제목 */}
        <div className="flex items-center gap-2 mb-8">
          <span className="text-xl">회원가입</span>
        </div>

        {/* 회원가입 입력 폼 */}
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
                  value: 6,
                  message:
                    "비밀번호는 최소 6자 이상이어야 합니다",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="w-full">
            <input
              className={`w-full p-3 rounded-md bg-gray-100 text-sm ${
                errors.confirmPassword
                  ? "border border-red-500"
                  : ""
              }`}
              type="password"
              placeholder="비밀번호 확인"
              {...register("confirmPassword", {
                required: "비밀번호 확인을 입력해주세요",
                validate: (value) =>
                  value === password ||
                  "비밀번호가 일치하지 않습니다",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* 약관 동의 */}
          <div className="flex flex-col gap-2 mt-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="serviceTerms"
                className="h-4 w-4 text-blue-600"
                {...register("serviceTerms", {
                  required: "서비스 이용약관에 동의해주세요",
                })}
              />
              <label
                htmlFor="serviceTerms"
                className="text-sm text-gray-700"
              >
                [필수] 서비스 이용약관 동의
              </label>
            </div>
            {errors.serviceTerms && (
              <p className="text-red-500 text-xs">
                {errors.serviceTerms.message}
              </p>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="marketingTerms"
                className="h-4 w-4 text-blue-600"
                {...register("marketingTerms")}
              />
              <label
                htmlFor="marketingTerms"
                className="text-sm text-gray-700"
              >
                [선택] 광고성 정보 수신 동의
              </label>
            </div>
          </div>

          {/* 회원가입 버튼 */}
          <button
            type="submit"
            className="w-full p-3 bg-[#2D3748] text-white rounded-md mt-6 text-center"
          >
            회원가입
          </button>
        </form>
      </div>
    </div>
  );
};
export default Signup;
