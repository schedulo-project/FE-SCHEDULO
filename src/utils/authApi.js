import axios from "axios";

// AuthContext에서 토큰을 가져와서 인증된 API 호출을 하는 유틸리티 함수
export const createAuthenticatedApi = (
  accessToken,
  refreshAccessToken,
  logout
) => {
  const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  // 요청 인터셉터 - 모든 요청에 토큰 자동 추가
  api.interceptors.request.use(
    (config) => {
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // 응답 인터셉터 - 토큰 만료 시 자동 갱신
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          console.error("토큰 갱신 실패:", refreshError);
          logout();
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

// 토큰이 필요한 API 호출을 위한 Hook과 함께 사용할 함수
export const getTokenFromAuth = () => {
  const accessToken = localStorage.getItem("accessToken");
  if (!accessToken) {
    throw new Error("인증이 필요합니다.");
  }
  return accessToken;
};
