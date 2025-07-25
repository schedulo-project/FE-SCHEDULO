import axios from "axios";
import GetCookie from "./GetCookie";

const checkPassword = async (password) => {
  const Logindata = await GetCookie();
  const token = Logindata.access;
  try {
    const response = await axios.get(
      `미정`,
      {
        //미정
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.error("Error checking password:", error);
    throw error; // 에러를 호출한 쪽에서 처리할 수 있도록 던짐
  }
};

export default checkPassword;
