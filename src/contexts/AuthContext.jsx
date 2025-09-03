import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth는 AuthProvider 내에서 사용되어야 합니다.");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 컴포넌트 마운트 시 localStorage에서 토큰 확인
  useEffect(() => {
    const savedAccessToken = localStorage.getItem("accessToken");
    const savedRefreshToken = localStorage.getItem("refreshToken");

    if (savedAccessToken && savedRefreshToken) {
      setAccessToken(savedAccessToken);
      setRefreshToken(savedRefreshToken);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  // 로그인 함수
  const login = (access, refresh) => {
    setAccessToken(access);
    setRefreshToken(refresh);
    setIsAuthenticated(true);
    localStorage.setItem("accessToken", access);
    localStorage.setItem("refreshToken", refresh);
  };

  // 로그아웃 함수
  const logout = () => {
    setAccessToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  // 토큰 갱신 함수
  const refreshAccessToken = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/users/token/refresh/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: refreshToken,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.access);
        localStorage.setItem("accessToken", data.access);
        return data.access;
      } else {
        // 리프레시 토큰이 만료된 경우
        logout();
        return null;
      }
    } catch (error) {
      console.error("토큰 갱신 실패:", error);
      logout();
      return null;
    }
  };

  const value = {
    isAuthenticated,
    accessToken,
    refreshToken,
    isLoading,
    login,
    logout,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
