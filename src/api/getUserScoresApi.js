import baseAxiosInstance from "./baseAxiosApi";

const getScores = async () => {
  try {
    const response = await baseAxiosInstance.get(`/users/scores/`);

    return response.data;
  } catch (error) {
    console.error("error", error);
  }
};

export default getScores;
