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
      console.error("Server Error:", error.response.data);
    } else {
      console.error("Network Error:", error.message);
    }
    throw error;
  }
};

export default addAndPatchStudyPlan;
