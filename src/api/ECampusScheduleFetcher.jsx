import baseAxiosInstance from "./baseAxiosApi";

// 1. 크롤링 시작
export const startECampusCrawling = async (token) => {
  try {
    const response = await baseAxiosInstance.get(
      "/users/crawling/",
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("ECampus 크롤링 시작 실패:", error);
    return { error: error.message };
  }
};

// 2. 상태 확인
export const checkECampusCrawlingStatus = async (
  token,
  taskId
) => {
  try {
    const response = await baseAxiosInstance.get(
      `/users/events/status/`,
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { task_id: taskId },
      }
    );
    return response.data;
  } catch (error) {
    console.error("ECampus 상태 확인 실패:", error);
    return { error: error.message };
  }
};
