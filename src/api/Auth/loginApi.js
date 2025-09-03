import baseAxiosInstance from "../baseAxiosApi";

const login = async (email, password) => {
  try {
    const response = await baseAxiosInstance.post("/users/login/", {
      email,
      password,
    });
    const { access, refresh } = response.data;
    return { access, refresh, success: true };
  } catch (error) {
    console.error("로그인 실패:", error);
    throw error;
  }
};

export default login;
