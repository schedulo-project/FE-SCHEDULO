import axios from "axios";

// baseURL
const baseURL = import.meta.env.VITE_API_BASE_URL;

const baseAxiosInstance = axios.create({
  baseURL,
  timeout: 1000 * 60,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

// 요청 인터셉터
baseAxiosInstance.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 (로그인 기능 제거로 주석 처리)
baseAxiosInstance.interceptors.response.use(
  (res) => res, // 응답 성공하면 그대로 통과시킴
  // 에러 나면 아래 로직으로 에러 핸들링
  async (error) => {
    // 이전 요청이 에러났을 때의 config 객체
    const originalRequest = error.config;

    // unauthorized(401) 에러인지 확인
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      // 같은 요청이 무한 반복되지 않도록 true로 설정. 같은 요청이 또 실패해도 재시도하지 않음.
      originalRequest._retry = true;

      // 토큰 갱신 로직 실행
      try {
        const refreshToken =
          localStorage.getItem("refreshToken");

        // refreshToken이 없으면 로그아웃 처리
        if (!refreshToken) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(error);
        }
        //여기에 나중에 실제 주소를 넣어줘야 한다.
        const response = await axios.post(
          "/api/v1/auth/refresh",
          null,
          {
            baseURL,
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const newAccessToken = response.data?.access;
        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return baseAxiosInstance(originalRequest);
        }
      } catch {
        // 토큰 갱신에 실패하면 로그인 페이지로 리다이렉트
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default baseAxiosInstance;
