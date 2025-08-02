import axios from "axios";
import GetCookie from "./GetCookie";

const changeSamwater = async (newId, newPassword) => {
  const Logindata = await GetCookie();
  const token = Logindata.access;

  try {
    const response = await axios.put(
      `https://schedulo.store/users/smul-update/`,
      {
        student_id: newId,
        student_password: newPassword,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("response", response);
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

export default changeSamwater;
