import baseAxiosInstance from "./baseAxiosApi";

const addAndPatchStudyPlan = async ({ exam, review }) => {
  try {
    const response = await baseAxiosInstance.post(
      `/users/studyroutine/`,
      {
        weeks_before_exam: exam,
        review_type: review,
      }
    );

    return response;
  } catch (error) {
    if (error.response) {
      // 서버 응답이 있는 경우
      console.error("Server Error:", error.response.data);
    } else {
      // 서버 응답이 없는 경우
      console.error("Network Error:", error.message);
    }
    throw error; // 에러를 호출한 쪽에서 처리할 수 있도록 던짐
  }
};

export default addAndPatchStudyPlan;
