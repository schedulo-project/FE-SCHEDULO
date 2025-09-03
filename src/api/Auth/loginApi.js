import axios from "axios";
const login = async (email, password) => {
  try {
    const response = await axios.post(
      "https://schedulo.store/users/login/",
      {
        email,
        password,
      }
    );
    const { access, refresh } = response.data;
    if (access) localStorage.setItem("accessToken", access);
    if (refresh) localStorage.setItem("refreshToken", refresh);
    return response.data;
  } catch (error) {
    console.error("로그인 실패:", error);
  }
};

export default login;
