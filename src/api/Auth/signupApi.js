import baseAxiosInstance from "../baseAxiosApi";

const signup = async (
  email,
  password,
  student_id,
  student_password
) => {
  if (student_id == null || student_password == null) {
    try {
      const response = await baseAxiosInstance.post(
        "/users/signup/",
        {
          email,
          password,
        }
      );
      return { data: response.data, success: true };
    } catch (error) {
      console.error("회원가입 실패:", error);
      throw error;
    }
  } else {
    try {
      const response = await baseAxiosInstance.post(
        "/users/signup/",
        {
          email,
          password,
          student_id,
          student_password,
        }
      );
      return { data: response.data, success: true };
    } catch (error) {
      console.error("회원가입 실패:", error);
      throw error;
    }
  }
};

export default signup;
