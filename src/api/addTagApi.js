import baseAxiosInstance from "./baseAxiosApi";

const addTag = async (tag) => {
  try {
    const response = await baseAxiosInstance.post(
      `/schedules/tags/`,
      {
        name: tag,
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

export default addTag;
