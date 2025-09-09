import baseAxiosInstance from "./baseAxiosApi";

const getTags = async () => {
  try {
    const response = await baseAxiosInstance.get(
      `/users/studyroutine/`
    );

    return response;
  } catch (error) {
    console.error("error", error);
  }
};

export default getTags;
