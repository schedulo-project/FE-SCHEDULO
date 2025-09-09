import baseAxiosInstance from "./baseAxiosApi";

const getStudyRoutine = async () => {
  try {
    const response = await baseAxiosInstance.get(
      `/users/studyroutine/`
    );

    return response;
  } catch (error) {
    console.error("error", error);
  }
};

export default getStudyRoutine;
