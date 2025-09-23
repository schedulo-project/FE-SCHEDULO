import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

const baseAxiosInstance = axios.create({
  baseURL,
  timeout: 1000 * 60,
  headers: {
    "Content-Type": "application/json",
    accept: "application/json",
  },
});

baseAxiosInstance.interceptors.request.use(async (config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

baseAxiosInstance.interceptors.response.use(
  (res) => res,

  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken =
          localStorage.getItem("refreshToken");

        if (!refreshToken) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return Promise.reject(error);
        }

        const response = await axios.post(
          "/users/refresh/",
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
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default baseAxiosInstance;
