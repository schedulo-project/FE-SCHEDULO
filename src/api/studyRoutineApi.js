import baseAxiosInstance from "./baseAxiosApi";

// 공부 습관 등록 및 수정
const createStudyRoutine = async (
  weeksBeforeExam,
  reviewType
) => {
  try {
    const formData = new FormData();
    formData.append("weeks_before_exam", weeksBeforeExam);
    formData.append("review_type", reviewType);

    const response = await baseAxiosInstance.post(
      "/users/studyroutine/",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error) {
    console.error("createStudyRoutine error:", error);
    throw error;
  }
};

// 공부 습관 조회
const getStudyRoutine = async () => {
  try {
    const response = await baseAxiosInstance.get(
      "/users/studyroutine/"
    );
    return response.data;
  } catch (error) {
    console.error("getStudyRoutine error:", error);
    throw error;
  }
};

export default createStudyRoutine;

export { createStudyRoutine, getStudyRoutine };
