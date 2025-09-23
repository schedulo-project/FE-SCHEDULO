import baseAxiosInstance from "./baseAxiosApi";

const checkCurrentPassword = async (currentPassword) => {
  try {
    const response = await baseAxiosInstance.post(
      `/users/pw/check/`,
      {
        current_password: currentPassword,
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

export default checkCurrentPassword;
